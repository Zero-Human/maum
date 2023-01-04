import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserOutput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  email: string;

  @Field(() => String)
  nickname: string;
}
