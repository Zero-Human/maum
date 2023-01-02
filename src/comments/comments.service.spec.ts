import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Posts } from 'src/posts/entity/posts.entity';
import { PostsService } from 'src/posts/posts.service';
import { User } from 'src/users/entity/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CommentsService } from './comments.service';
import { CreateComment } from './dto/create-comment.dto';
import { UpdateComment } from './dto/update-comment.dto';
import { Comments } from './entity/comments.entity';
const mockPostService = () => ({
  findPost: jest.fn(),
});
const mockRepository = () => ({
  save: jest.fn((comment) => comment),
  create: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(() => {
    return {
      raw: undefined,
      affected: 1,
    } as DeleteResult;
  }),
});
describe('CommentsService', () => {
  let service: CommentsService;
  let spyReositroty: Repository<Comments>;
  let spyPostService: PostsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comments),
          useFactory: mockRepository,
        },
        {
          provide: PostsService,
          useFactory: mockPostService,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    spyReositroty = module.get(getRepositoryToken(Comments));
    spyPostService = module.get<PostsService>(PostsService);
  });

  it('createComment 댓글 생성', async () => {
    const creatComment: CreateComment = {
      postId: 1,
      content: 'test',
    };
    const user: User = {
      id: 1,
      email: 'test@test.com',
      password: '123',
      nickname: 'test',
      posts: [],
    };
    const post: Posts = {
      id: 1,
      title: 'title',
      content: 'content',
      author: user,
      updatedAt: new Date(),
      createdAt: new Date(),
      comments: [],
    };
    const comment: Comments = {
      id: 1,
      content: 'test',
      author: null,
      createdAt: undefined,
      updatedAt: undefined,
      post: new Posts(),
      parentComment: null,
      childComments: [],
    };
    spyPostService.findPost = jest.fn(async () => post);
    spyReositroty.create = jest.fn((): any => comment);

    const result = await service.createComment(creatComment, user);

    comment.author = user;
    comment.post = post;
    expect(spyPostService.findPost).toHaveBeenCalled();
    expect(spyPostService.findPost).toHaveBeenCalledWith(creatComment.postId);
    expect(spyReositroty.create).toHaveBeenCalled();
    expect(spyReositroty.create).toHaveBeenCalledWith({
      content: creatComment.content,
    });
    expect(spyReositroty.save).toHaveBeenCalled();
    expect(spyReositroty.save).toHaveBeenCalledWith({
      ...comment,
    });
    expect(result).toEqual(comment);
  });

  it('createComment 대댓글 생성', async () => {
    const creatComment: CreateComment = {
      postId: 1,
      content: 'test',
      parentCommentId: 2,
    };
    const user: User = {
      id: 1,
      email: 'test@test.com',
      password: '123',
      nickname: 'test',
      posts: [],
    };
    const post: Posts = {
      id: 1,
      title: 'title',
      content: 'content',
      author: user,
      updatedAt: new Date(),
      createdAt: new Date(),
      comments: [],
    };
    const comment: Comments = {
      id: 1,
      content: 'test',
      author: null,
      createdAt: undefined,
      updatedAt: undefined,
      post: new Posts(),
      parentComment: null,
      childComments: [],
    };
    spyPostService.findPost = jest.fn(async () => post);
    spyReositroty.create = jest.fn((): any => comment);
    spyReositroty.findOne = jest.fn(async () => comment);

    const result = await service.createComment(creatComment, user);

    comment.author = user;
    comment.post = post;
    comment.parentComment = comment;
    expect(spyPostService.findPost).toHaveBeenCalled();
    expect(spyPostService.findPost).toHaveBeenCalledWith(creatComment.postId);
    expect(spyReositroty.create).toHaveBeenCalled();
    expect(spyReositroty.create).toHaveBeenCalledWith({
      content: creatComment.content,
    });
    expect(spyReositroty.findOne).toHaveBeenCalled();
    expect(spyReositroty.findOne).toHaveBeenCalledWith({
      where: {
        id: creatComment.parentCommentId,
      },
    });
    expect(spyReositroty.save).toHaveBeenCalled();
    expect(spyReositroty.save).toHaveBeenCalledWith({
      ...comment,
    });
    expect(result).toEqual(comment);
  });

  it('updateComment 댓글 수정', async () => {
    const updateComment: UpdateComment = {
      content: 'test',
      commentId: 1,
    };
    const user: User = {
      id: 1,
      email: 'test@test.com',
      password: '123',
      nickname: 'test',
      posts: [],
    };
    const comment: Comments = {
      id: 1,
      content: 'test',
      author: null,
      createdAt: undefined,
      updatedAt: undefined,
      post: new Posts(),
      parentComment: null,
      childComments: [],
    };
    spyReositroty.findOne = jest.fn(async () => comment);
    spyReositroty.update = jest.fn();

    const result = await service.updateComment(updateComment, user);

    expect(spyReositroty.findOne).toHaveBeenCalled();
    expect(spyReositroty.findOne).toHaveBeenCalledWith({
      where: {
        id: updateComment.commentId,
        author: user,
      },
    });
    expect(spyReositroty.update).toHaveBeenCalled();
    expect(spyReositroty.update).toHaveBeenCalledWith(updateComment.commentId, {
      content: updateComment.content,
    });
    expect(spyReositroty.findOne).toHaveBeenCalled();
    expect(spyReositroty.findOne).toHaveBeenCalledWith({
      where: { id: updateComment.commentId },
    });
    expect(result).toEqual(comment);
  });
  it('updateComment 댓글 수정', async () => {
    const user: User = {
      id: 1,
      email: 'test@test.com',
      password: '123',
      nickname: 'test',
      posts: [],
    };
    const comment: Comments = {
      id: 1,
      content: 'test',
      author: null,
      createdAt: undefined,
      updatedAt: undefined,
      post: new Posts(),
      parentComment: null,
      childComments: [],
    };
    const commentId = 1;
    spyReositroty.findOne = jest.fn(async () => comment);
    spyReositroty.update = jest.fn();

    const result = await service.deleteComment(commentId, user);

    expect(spyReositroty.findOne).toHaveBeenCalled();
    expect(spyReositroty.findOne).toHaveBeenCalledWith({
      where: {
        id: commentId,
        author: user,
      },
    });
    expect(spyReositroty.delete).toHaveBeenCalled();
    expect(spyReositroty.delete).toHaveBeenCalledWith(commentId);

    expect(result).toEqual(true);
  });
});
