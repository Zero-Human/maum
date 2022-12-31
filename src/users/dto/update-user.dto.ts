import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { User } from '../entity/user.entity';

@InputType()
export class UpdateUser extends PartialType(OmitType(User, ['id'])) {}
