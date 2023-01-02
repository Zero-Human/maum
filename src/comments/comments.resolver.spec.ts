import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/users/entity/user.entity';
import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';
import { CreateComment } from './dto/create-comment.dto';
import { UpdateComment } from './dto/update-comment.dto';
const mockService = () => ({
  createComment: jest.fn(
    (creatComment: CreateComment, user: User) => creatComment,
  ),
  updateComment: jest.fn(
    (updateComment: UpdateComment, user: User) => updateComment,
  ),
  deleteComment: jest.fn((commentid: number, user: User) => true),
});
describe('CommentsResolver', () => {
  let resolver: CommentsResolver;
  let spyService: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsResolver,
        {
          provide: CommentsService,
          useFactory: mockService,
        },
      ],
    }).compile();

    resolver = module.get<CommentsResolver>(CommentsResolver);
    spyService = module.get<CommentsService>(CommentsService);
  });

  it('createComment 댓글 생성 ', async () => {
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
    const result = await resolver.createComment(creatComment, user);

    expect(spyService.createComment).toHaveBeenCalled();
    expect(spyService.createComment).toHaveBeenCalledWith(creatComment, user);
    expect(result).toEqual(creatComment);
  });

  it('createComment 대댓글 생성 ', async () => {
    const creatComment: CreateComment = {
      postId: 1,
      content: 'test',
      parentCommentId: 1,
    };
    const user: User = {
      id: 1,
      email: 'test@test.com',
      password: '123',
      nickname: 'test',
      posts: [],
    };
    const result = await resolver.createComment(creatComment, user);

    expect(spyService.createComment).toHaveBeenCalled();
    expect(spyService.createComment).toHaveBeenCalledWith(creatComment, user);
    expect(result).toEqual(creatComment);
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
    const result = await resolver.updateComment(updateComment, user);

    expect(spyService.updateComment).toHaveBeenCalled();
    expect(spyService.updateComment).toHaveBeenCalledWith(updateComment, user);
    expect(result).toEqual(updateComment);
  });

  it('updateComment 댓글 수정', async () => {
    const commentId = 1;
    const user: User = {
      id: 1,
      email: 'test@test.com',
      password: '123',
      nickname: 'test',
      posts: [],
    };
    const result = await resolver.deleteComment(commentId, user);

    expect(spyService.deleteComment).toHaveBeenCalled();
    expect(spyService.deleteComment).toHaveBeenCalledWith(commentId, user);
    expect(result).toEqual(true);
  });
});
