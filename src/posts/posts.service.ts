import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
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
}
