import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUser } from './dto/create-user.dto';
import { SignInInput } from './dto/signin.dto';
import { UpdateUser } from './dto/update-user.dto';
import { UserOutput } from './dto/user.dto';
import { User } from './entity/user.entity';
import { GqlAuthGuard } from '../common/guard/grapql.guard';
import { UsersService } from './users.service';
import { UserId } from 'src/common/decorator/user-id.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}
  @Query(() => Boolean)
  test(): boolean {
    return true;
  }
  @Mutation(() => UserOutput)
  async signUp(@Args('input') createUser: CreateUser): Promise<UserOutput> {
    return await this.userService.createUser(createUser);
  }
  @Mutation(() => String)
  async signIn(@Args('input') signInInput: SignInInput): Promise<string> {
    return await this.userService.signIn(signInInput);
  }
  @Mutation(() => UserOutput)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @Args('input') updateUser: UpdateUser,
    @UserId() userId: number,
  ): Promise<UserOutput> {
    return await this.userService.updateUser(userId, updateUser);
  }
  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteUser(@UserId() userId: number): Promise<boolean> {
    return await this.userService.deleteUser(userId);
  }
}
