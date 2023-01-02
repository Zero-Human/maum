import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/common/decorator/user.decorator';
import { GqlAuthGuard } from 'src/common/guard/grapql.guard';
import { User } from 'src/users/entity/user.entity';
import { CommentsService } from './comments.service';
import { CreateComment } from './dto/create-comment.dto';
import { CreateRecomment } from './dto/create-recomment.dto';
import { Comments } from './entity/comments.entity';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentService: CommentsService) {}

  @Mutation(() => Comments)
  @UseGuards(GqlAuthGuard)
  async createComment(
    @Args('input') createComment: CreateComment,
    @AuthUser() user: User,
  ): Promise<Comments> {
    return await this.commentService.createComment(createComment, user);
  }

  @Mutation(() => Comments)
  @UseGuards(GqlAuthGuard)
  async createRecomment(
    @Args('input') createRecomment: CreateRecomment,
    @AuthUser() user: User,
  ): Promise<Comments> {
    return await this.commentService.createRecomment(createRecomment, user);
  }
}
