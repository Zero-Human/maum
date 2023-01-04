import { Test, TestingModule } from '@nestjs/testing';
import { number } from 'joi';
import { CreateUser } from './dto/create-user.dto';
import { SignInInput } from './dto/signin.dto';
import { UpdateUser } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
const user: User = {
  id: 1,
  email: 'email@test.com',
  password: 'password',
  nickname: 'nickname',
  posts: [],
};
const token = 'token';

const mockService = () => ({
  createUser: jest.fn((createUser) => user),
  signIn: jest.fn((signInInput) => token),
  updateUser: jest.fn((userId, updateUser) => user),
  deleteUser: jest.fn((userId) => true),
});

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let spyService: UsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useFactory: mockService,
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    spyService = module.get<UsersService>(UsersService);
  });

  it('signUp ', async () => {
    const createUser: CreateUser = {
      email: 'email@test.com',
      password: 'password',
      nickname: 'nickname',
    };
    const result = await resolver.signUp(createUser);

    expect(spyService.createUser).toHaveBeenCalled();
    expect(spyService.createUser).toHaveBeenCalledWith(createUser);
    expect(result).toEqual(user);
  });

  it('signIn ', async () => {
    const signInInput: SignInInput = {
      email: 'email@test.com',
      password: 'password',
    };
    const result = await resolver.signIn(signInInput);

    expect(spyService.signIn).toHaveBeenCalled();
    expect(spyService.signIn).toHaveBeenCalledWith(signInInput);
    expect(result).toEqual(token);
  });

  it('updateUser ', async () => {
    const updateUser: UpdateUser = {
      email: 'email@test.com',
      password: 'password',
    };

    const result = await resolver.updateUser(updateUser, user.id);

    expect(spyService.updateUser).toHaveBeenCalled();
    expect(spyService.updateUser).toHaveBeenCalledWith(user.id, updateUser);
    expect(result).toEqual(user);
  });

  it('deleteUser ', async () => {
    const result = await resolver.deleteUser(user.id);

    expect(spyService.deleteUser).toHaveBeenCalled();
    expect(spyService.deleteUser).toHaveBeenCalledWith(user.id);
    expect(result).toEqual(true);
  });
});
