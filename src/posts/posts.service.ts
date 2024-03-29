import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { DeleteResult, ILike, IsNull, Repository } from 'typeorm';
import { CreatePost } from './dto/create-post.dto';
import { UpdatePost } from './dto/update-post.dto';
import { Posts } from './entity/posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private readonly postRepository: Repository<Posts>,
  ) {}

  async createPost(createPost: CreatePost, user: User): Promise<Posts> {
    const post: Posts = this.postRepository.create(createPost);
    post.author = user;
    return await this.postRepository.save(post);
  }

  async findPost(postId: number): Promise<Posts> {
    const post: Posts = await this.postRepository.findOne({
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
    if (!post) {
      throw new BadRequestException(['Post Id 값이 잘못되었습니다.']);
    }
    return post;
  }

  async searchPosts(postTitle: string): Promise<Posts[]> {
    return await this.postRepository.find({
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
  }

  async deletePost(postId: number, user: User): Promise<boolean> {
    const post: Posts = await this.postRepository.findOne({
      where: { id: postId, author: user },
      relations: {
        author: true,
      },
    });
    if (!post) {
      throw new BadRequestException(['Post Id 값이 잘못되었습니다.']);
    }
    const result: DeleteResult = await this.postRepository.delete(postId);
    if (result.affected) {
      return true;
    }
    return false;
  }
  async updatePost(updatePost: UpdatePost, user: User): Promise<Posts> {
    const post: Posts = await this.postRepository.findOne({
      where: { id: updatePost.id, author: user },
      relations: {
        author: true,
      },
    });
    if (!post) {
      throw new BadRequestException(['Post Id 값이 잘못되었습니다.']);
    }
    await this.postRepository.update(updatePost.id, updatePost);
    return await this.postRepository.findOne({
      where: { id: updatePost.id },
    });
  }

  async findPostsByUser(user: User): Promise<Posts[]> {
    return await this.postRepository.find({
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
  }
}
