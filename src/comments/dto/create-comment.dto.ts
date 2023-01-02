import { PickType, InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';
import { Comments } from '../entity/comments.entity';

@InputType()
export class CreateComment extends PickType(Comments, ['content']) {
  @Field(() => Int)
  @IsNumber()
  postId: number;
  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  parentCommentId?: number;
}
