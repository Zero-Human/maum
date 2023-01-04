import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/common/decorator/user.decorator';
import { GqlAuthGuard } from 'src/common/guard/grapql.guard';
import { User } from 'src/users/entity/user.entity';
import { CommentsService } from './comments.service';
import { CreateComment } from './dto/create-comment.dto';
import { UpdateComment } from './dto/update-comment.dto';
import { Comments } from './entity/comments.entity';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentService: CommentsService) {}

  @Mutation(() => Comments, { description: '댓글 및 대댓글 생성 기능' })
  @UseGuards(GqlAuthGuard)
  async createComment(
    @Args('input') createComment: CreateComment,
    @AuthUser() user: User,
  ): Promise<Comments> {
    return await this.commentService.createComment(createComment, user);
  }

  @Mutation(() => Comments, { description: '댓글 및 대댓글 수정 기능' })
  @UseGuards(GqlAuthGuard)
  async updateComment(
    @Args('input') updateComment: UpdateComment,
    @AuthUser() user: User,
  ): Promise<Comments> {
    return await this.commentService.updateComment(updateComment, user);
  }

  @Mutation(() => Boolean, { description: '댓글 및 대댓글 삭제 기능' })
  @UseGuards(GqlAuthGuard)
  async deleteComment(
    @Args('commentId') CommentId: number,
    @AuthUser() user: User,
  ): Promise<boolean> {
    return await this.commentService.deleteComment(CommentId, user);
  }
}
