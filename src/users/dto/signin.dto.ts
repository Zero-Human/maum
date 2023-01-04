import { PickType, InputType } from '@nestjs/graphql';
import { User } from '../entity/user.entity';

@InputType()
export class SignInInput extends PickType(User, ['password', 'email']) {}
