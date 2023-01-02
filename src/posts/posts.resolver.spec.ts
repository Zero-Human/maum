import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/users/entity/user.entity';
import { CreatePost } from './dto/create-post.dto';
import { UpdatePost } from './dto/update-post.dto';
import { Posts } from './entity/posts.entity';
import { PostsResolver } from './posts.resolver';
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
const mockService = () => ({
  findPost: jest.fn((postId) => post),
  searchPosts: jest.fn((postTitle) => [post]),
  findPostsByUser: jest.fn((user) => [post]),
  createPost: jest.fn((creatPost, user) => post),
  deletePost: jest.fn((postId, user) => true),
  updatePost: jest.fn((updatePost, user) => post),
});
describe('PostsResolver', () => {
  let resolver: PostsResolver;
  let spyService: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsResolver,
        {
          provide: PostsService,
          useFactory: mockService,
        },
      ],
    }).compile();

    resolver = module.get<PostsResolver>(PostsResolver);
    spyService = module.get<PostsService>(PostsService);
  });

  it('readPost', async () => {
    const postId = 1;
    const result = await resolver.readPost(postId);

    expect(spyService.findPost).toHaveBeenCalled();
    expect(spyService.findPost).toHaveBeenCalledWith(postId);
    expect(result).toEqual(post);
  });

  it('searchPosts', async () => {
    const postTitle = 'title';
    const result = await resolver.searchPosts(postTitle);

    expect(spyService.searchPosts).toHaveBeenCalled();
    expect(spyService.searchPosts).toHaveBeenCalledWith(postTitle);
    expect(result).toEqual([post]);
  });

  it('readMyPosts', async () => {
    const result = await resolver.readMyPosts(user);

    expect(spyService.findPostsByUser).toHaveBeenCalled();
    expect(spyService.findPostsByUser).toHaveBeenCalledWith(user);
    expect(result).toEqual([post]);
  });

  it('createPost', async () => {
    const creatPost: CreatePost = {
      title: 'title',
      content: 'contnent',
    };

    const result = await resolver.createPost(creatPost, user);

    expect(spyService.createPost).toHaveBeenCalled();
    expect(spyService.createPost).toHaveBeenCalledWith(creatPost, user);
    expect(result).toEqual(post);
  });

  it('deletePost', async () => {
    const postId = 1;

    const result = await resolver.deletePost(postId, user);

    expect(spyService.deletePost).toHaveBeenCalled();
    expect(spyService.deletePost).toHaveBeenCalledWith(postId, user);
    expect(result).toEqual(true);
  });
  it('updatePost', async () => {
    const updatePost: UpdatePost = {
      title: 'title',
      content: 'contnent',
      id: 1,
    };

    const result = await resolver.updatePost(updatePost, user);

    expect(spyService.updatePost).toHaveBeenCalled();
    expect(spyService.updatePost).toHaveBeenCalledWith(updatePost, user);
    expect(result).toEqual(post);
  });
});
