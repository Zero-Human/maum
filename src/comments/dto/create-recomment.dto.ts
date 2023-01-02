import { PickType, InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { Comments } from '../entity/comments.entity';

@InputType()
export class CreateRecomment extends PickType(Comments, ['content']) {
  @Field(() => Int)
  @IsNumber()
  postId: number;
  @Field(() => Int)
  @IsNumber()
  commentId: number;
}
