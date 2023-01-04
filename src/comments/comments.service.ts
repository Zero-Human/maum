import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/posts/entity/posts.entity';
import { PostsService } from 'src/posts/posts.service';
import { User } from 'src/users/entity/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateComment } from './dto/create-comment.dto';
import { UpdateComment } from './dto/update-comment.dto';
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
    if (createComment?.parentCommentId) {
      const parentComment: Comments = await this.commentRepository.findOne({
        where: {
          id: createComment.parentCommentId,
        },
      });
      if (!parentComment) {
        throw new BadRequestException(['commentId의 값이 잘못되었습니다.']);
      }
      comment.parentComment = parentComment;
    }
    comment.post = post;
    comment.author = user;

    return await this.commentRepository.save(comment);
  }

  async updateComment(
    updateComment: UpdateComment,
    user: User,
  ): Promise<Comments> {
    const comment: Comments = await this.commentRepository.findOne({
      where: {
        id: updateComment.commentId,
        author: user,
      },
    });
    if (!comment) {
      throw new BadRequestException(['commentId의 값이 잘못되었습니다.']);
    }
    await this.commentRepository.update(updateComment.commentId, {
      content: updateComment.content,
    });
    return await this.commentRepository.findOne({
      where: { id: updateComment.commentId },
    });
  }

  async deleteComment(commentId: number, user: User): Promise<boolean> {
    const comment: Comments = await this.commentRepository.findOne({
      where: {
        id: commentId,
        author: user,
      },
    });
    if (!comment) {
      throw new BadRequestException(['commentId의 값이 잘못되었습니다.']);
    }
    const result: DeleteResult = await this.commentRepository.delete(commentId);
    if (result.affected) {
      return true;
    }
    return false;
  }
}
