import { PickType, InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { Comments } from '../entity/comments.entity';

@InputType()
export class UpdateComment extends PickType(Comments, ['content']) {
  @Field(() => Int, { nullable: true })
  @IsNumber()
  commentId?: number;
}
