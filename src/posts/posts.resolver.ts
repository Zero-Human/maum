import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/common/decorator/user.decorator';
import { GqlAuthGuard } from 'src/common/guard/grapql.guard';
import { User } from 'src/users/entity/user.entity';
import { CreatePost } from './dto/create-post.dto';
import { UpdatePost } from './dto/update-post.dto';
import { Posts } from './entity/posts.entity';
import { PostsService } from './posts.service';

@Resolver()
export class PostsResolver {
  constructor(private readonly postService: PostsService) {}
  @Query(() => Posts)
  async readPost(@Args('postId') postId: number): Promise<Posts> {
    return await this.postService.findPost(postId);
  }
  @Query(() => [Posts])
  async searchPosts(@Args('postTitle') postTitle: string): Promise<Posts[]> {
    return await this.postService.searchPosts(postTitle);
  }
  @Query(() => [Posts])
  @UseGuards(GqlAuthGuard)
  async readMyPosts(@AuthUser() user: User): Promise<Posts[]> {
    return await this.postService.findPostsByUser(user);
  }

  @Mutation(() => Posts)
  @UseGuards(GqlAuthGuard)
  async createPost(
    @Args('input') createPost: CreatePost,
    @AuthUser() user: User,
  ): Promise<Posts> {
    return await this.postService.createPost(createPost, user);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deletePost(
    @Args('postId') postId: number,
    @AuthUser() user: User,
  ): Promise<boolean> {
    return await this.postService.deletePost(postId, user);
  }

  @Mutation(() => Posts)
  @UseGuards(GqlAuthGuard)
  async updatePost(
    @Args('input') updatePost: UpdatePost,
    @AuthUser() user: User,
  ): Promise<Posts> {
    return await this.postService.updatePost(updatePost, user);
  }
}
