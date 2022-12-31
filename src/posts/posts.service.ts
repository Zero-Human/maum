import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { CreatePost } from './dto/create-post.dto';
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
      where: { id: postId },
      relations: {
        author: true,
      },
    });
    if (!post) {
      //TODO: error 발생
    }
    return post;
  }

  async searchPosts(postTitle: string): Promise<Posts[]> {
    return await this.postRepository.find({
      where: {
        title: ILike(`%${postTitle}%`),
      },
      relations: {
        author: true,
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
      //TODO: error 발생
    }
    const result: DeleteResult = await this.postRepository.delete(postId);
    if (result.affected) {
      return true;
    }
    return false;
  }

  async findPostsByUser(user: User): Promise<Posts[]> {
    return await this.postRepository.find({
      where: { author: user },
      relations: {
        author: true,
      },
    });
  }
}
