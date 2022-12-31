import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/common/decorator/user.decorator';
import { GqlAuthGuard } from 'src/common/guard/grapql.guard';
import { User } from 'src/users/entity/user.entity';
import { CreatePost } from './dto/create-post.dto';
import { Posts } from './entity/posts.entity';
import { PostsService } from './posts.service';

@Resolver()
export class PostsResolver {
  constructor(private readonly postService: PostsService) {}
  @Query(() => Posts)
  async readPost(@Args('postId') postId: number): Promise<Posts> {
    return await this.postService.readPost(postId);
  }

  @Mutation(() => Posts)
  @UseGuards(GqlAuthGuard)
  async createPost(
    @Args('input') createPost: CreatePost,
    @AuthUser() user: User,
  ): Promise<Posts> {
    return await this.postService.createPost(createPost, user);
  }
}
