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
  @Query(() => Posts, { description: '게시글 상세정보 조회 기능' })
  async readPost(@Args('postId') postId: number): Promise<Posts> {
    return await this.postService.findPost(postId);
  }
  @Query(() => [Posts], { description: '게시글 제목으로 조회 기능' })
  async searchPosts(@Args('postTitle') postTitle: string): Promise<Posts[]> {
    return await this.postService.searchPosts(postTitle);
  }
  @Query(() => [Posts], { description: '자신이 생성한 게시글 조회 기능' })
  @UseGuards(GqlAuthGuard)
  async readMyPosts(@AuthUser() user: User): Promise<Posts[]> {
    return await this.postService.findPostsByUser(user);
  }

  @Mutation(() => Posts, { description: '게시글 생성 기능' })
  @UseGuards(GqlAuthGuard)
  async createPost(
    @Args('input') createPost: CreatePost,
    @AuthUser() user: User,
  ): Promise<Posts> {
    return await this.postService.createPost(createPost, user);
  }

  @Mutation(() => Boolean, { description: '게시글 삭제 기능' })
  @UseGuards(GqlAuthGuard)
  async deletePost(
    @Args('postId') postId: number,
    @AuthUser() user: User,
  ): Promise<boolean> {
    return await this.postService.deletePost(postId, user);
  }

  @Mutation(() => Posts, { description: '게시글 수정 기능' })
  @UseGuards(GqlAuthGuard)
  async updatePost(
    @Args('input') updatePost: UpdatePost,
    @AuthUser() user: User,
  ): Promise<Posts> {
    return await this.postService.updatePost(updatePost, user);
  }
}
