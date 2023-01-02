import { PickType, InputType, Int, Field } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { Posts } from '../entity/posts.entity';

@InputType()
export class UpdatePost extends PickType(Posts, ['title', 'content']) {
  @Field(() => Int)
  @IsNumber()
  id: number;
}
