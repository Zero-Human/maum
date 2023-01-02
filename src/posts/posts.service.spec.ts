import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { DeleteResult, ILike, IsNull, Repository } from 'typeorm';
import { CreatePost } from './dto/create-post.dto';
import { UpdatePost } from './dto/update-post.dto';
import { Posts } from './entity/posts.entity';
import { PostsService } from './posts.service';
const user: User = {
  id: 1,
  email: 'test@test.com',
  password: '123',
  nickname: 'nickname',
  posts: [],
};
const post: Posts = {
  id: 1,
  title: 'title',
  content: 'content',
  author: user,
  updatedAt: undefined,
  createdAt: undefined,
  comments: [],
};
const mockRepository = () => ({
  save: jest.fn((post) => post),
  create: jest.fn((createPost) => post),
  findOne: jest.fn((postId) => post),
  find: jest.fn((postTitle) => [post]),
  update: jest.fn(),
  delete: jest.fn(() => {
    return {
      raw: undefined,
      affected: 1,
    } as DeleteResult;
  }),
});
describe('PostsService', () => {
  let service: PostsService;
  let spyReositroty: Repository<Posts>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Posts),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    spyReositroty = module.get(getRepositoryToken(Posts));
  });

  it('createPost', async () => {
    const creatPost: CreatePost = {
      title: 'title',
      content: 'content',
    };
    const result = await service.createPost(creatPost, user);

    post.author = user;
    expect(spyReositroty.create).toHaveBeenCalled();
    expect(spyReositroty.create).toHaveBeenCalledWith(creatPost);

    expect(spyReositroty.save).toHaveBeenCalled();
    expect(spyReositroty.save).toHaveBeenCalledWith(post);
    expect(result).toEqual(post);
  });

  it('findPost', async () => {
    const postId = 1;
    const result = await service.findPost(postId);

    expect(spyReositroty.findOne).toHaveBeenCalled();
    expect(spyReositroty.findOne).toHaveBeenCalledWith({
      relations: {
        author: true,
        comments: {
          author: true,
          childComments: true,
        },
      },
      where: {
        id: postId,
        comments: {
          parentComment: IsNull(),
        },
      },
    });
    expect(result).toEqual(post);
  });

  it('searchPosts', async () => {
    const postTitle = 'title';
    const result = await service.searchPosts(postTitle);

    expect(spyReositroty.find).toHaveBeenCalled();
    expect(spyReositroty.find).toHaveBeenCalledWith({
      where: {
        title: ILike(`%${postTitle}%`),
        comments: {
          parentComment: IsNull(),
        },
      },
      relations: {
        author: true,
        comments: {
          author: true,
          childComments: true,
        },
      },
    });
    expect(result).toEqual([post]);
  });

  it('deletePost', async () => {
    const postId = 1;
    const result = await service.deletePost(postId, user);

    expect(spyReositroty.findOne).toHaveBeenCalled();
    expect(spyReositroty.findOne).toHaveBeenCalledWith({
      where: { id: postId, author: user },
      relations: {
        author: true,
      },
    });
    expect(spyReositroty.delete).toHaveBeenCalled();
    expect(spyReositroty.delete).toHaveBeenCalledWith(postId);
    expect(result).toEqual(true);
  });

  it('updatePost', async () => {
    const updatePost: UpdatePost = {
      id: 1,
      title: 'title',
      content: 'content',
    };
    const result = await service.updatePost(updatePost, user);

    expect(spyReositroty.findOne).toHaveBeenCalled();
    expect(spyReositroty.findOne).toHaveBeenCalledWith({
      where: { id: updatePost.id, author: user },
      relations: {
        author: true,
      },
    });
    expect(spyReositroty.update).toHaveBeenCalled();
    expect(spyReositroty.update).toHaveBeenCalledWith(
      updatePost.id,
      updatePost,
    );

    expect(spyReositroty.findOne).toHaveBeenCalled();
    expect(spyReositroty.findOne).toHaveBeenCalledWith({
      where: { id: updatePost.id },
    });
    expect(result).toEqual(post);
  });

  it('findPostsByUser', async () => {
    const result = await service.findPostsByUser(user);

    expect(spyReositroty.find).toHaveBeenCalled();
    expect(spyReositroty.find).toHaveBeenCalledWith({
      where: {
        author: user,
        comments: {
          parentComment: IsNull(),
        },
      },
      relations: {
        author: true,
        comments: {
          author: true,
          childComments: true,
        },
      },
    });
    expect(result).toEqual([post]);
  });
});
