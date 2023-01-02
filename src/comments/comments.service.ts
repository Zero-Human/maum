import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/posts/entity/posts.entity';
import { PostsService } from 'src/posts/posts.service';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateComment } from './dto/create-comment.dto';
import { CreateRecomment } from './dto/create-recomment.dto';
import { Comments } from './entity/comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentRepository: Repository<Comments>,
    private readonly postService: PostsService,
  ) {}
  async createComment(
    createComment: CreateComment,
    user: User,
  ): Promise<Comments> {
    const post: Posts = await this.postService.findPost(createComment.postId);
    const comment: Comments = this.commentRepository.create({
      content: createComment.content,
    });
    comment.post = post;
    comment.author = user;
    return await this.commentRepository.save(comment);
  }

  async createRecomment(
    createRecomment: CreateRecomment,
    user: User,
  ): Promise<Comments> {
    const post: Posts = await this.postService.findPost(createRecomment.postId);
    const parentComment: Comments = await this.commentRepository.findOne({
      where: {
        id: createRecomment.commentId,
      },
    });
    if (!parentComment) {
      throw new BadRequestException(['commentId의 값이 잘못되었습니다.']);
    }
    const comment: Comments = this.commentRepository.create({
      content: createRecomment.content,
    });
    comment.post = post;
    comment.author = user;
    comment.parentComment = parentComment;
    return await this.commentRepository.save(comment);
  }
}
