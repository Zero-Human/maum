import { PickType, InputType } from '@nestjs/graphql';
import { User } from '../entity/user.entity';

@InputType()
export class CreateUser extends PickType(User, [
  'email',
  'password',
  'nickname',
]) {}
