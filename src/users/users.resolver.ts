import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUser } from './dto/create-user.dto';
import { SignInInput } from './dto/signin.dto';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}
  @Query(() => Boolean)
  test(): boolean {
    return true;
  }
  @Mutation(() => User)
  async signUp(@Args('input') createUser: CreateUser): Promise<User> {
    return await this.userService.createUser(createUser);
  }
  @Mutation(() => String)
  async signIn(@Args('input') signInInput: SignInInput): Promise<string> {
    return await this.userService.signIn(signInInput);
  }
}
