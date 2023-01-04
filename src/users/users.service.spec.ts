import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payload } from 'src/common/interface/payload.interface';
import { Repository } from 'typeorm';
import { CreateUser } from './dto/create-user.dto';
import { SignInInput } from './dto/signin.dto';
import { UpdateUser } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';

const user: User = {
  id: 1,
  email: 'email@test.com',
  password: 'password',
  nickname: 'nickname',
  posts: [],
};
const token = 'token';

const mockRepository = () => ({
  create: jest.fn((createUser) => user),
  save: jest.fn((user) => user),
  findOne: jest.fn((email) => user),
  update: jest.fn((updateUser) => user),
});

describe('UsersService', () => {
  let service: UsersService;
  let spyReositroty: Repository<User>;
  let spyJwtService: JwtService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockRepository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn((payload) => token),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    spyReositroty = module.get(getRepositoryToken(User));
    spyJwtService = module.get<JwtService>(JwtService);
  });

  it('createUser', async () => {
    const createUser: CreateUser = {
      email: 'email@test.com',
      password: 'password',
      nickname: 'nickname',
    };
    spyReositroty.findOne = jest.fn();

    const result = await service.createUser(createUser);

    expect(spyReositroty.findOne).toHaveBeenCalled();
    expect(spyReositroty.findOne).toHaveBeenCalledWith({
      select: { email: true },
      where: { email: createUser.email },
    });

    expect(spyReositroty.findOne).toHaveBeenCalled();
    expect(spyReositroty.findOne).toHaveBeenCalledWith({
      select: { nickname: true },
      where: { nickname: createUser.nickname },
    });

    expect(spyReositroty.create).toHaveBeenCalled();
    expect(spyReositroty.create).toHaveBeenCalledWith(createUser);

    expect(spyReositroty.save).toHaveBeenCalled();
    expect(spyReositroty.save).toHaveBeenCalledWith(user);
    expect(result).toEqual(user);
  });

  it('signIn', async () => {
    const signInInput: SignInInput = {
      email: 'email@test.com',
      password: 'password',
    };
    const payload: Payload = {
      id: user.id,
      nickname: user.nickname,
    };
    const result = await service.signIn(signInInput);

    expect(spyReositroty.findOne).toHaveBeenCalled();
    expect(spyReositroty.findOne).toHaveBeenCalledWith({
      select: { id: true, password: true, email: true, nickname: true },
      where: { email: signInInput.email },
    });

    expect(spyJwtService.sign).toHaveBeenCalled();
    expect(spyJwtService.sign).toHaveBeenCalledWith(payload);
    expect(result).toEqual(token);
  });

  it('updateUser', async () => {
    const updateUser: UpdateUser = {
      email: 'email@test.com',
      nickname: 'nickname',
    };
    spyReositroty.findOne = jest.fn(async (src) => {
      const { where }: any = src;
      if (where.id) {
        return user;
      }
      return null;
    });

    const result = await service.updateUser(user.id, updateUser);

    expect(spyReositroty.findOne).toHaveBeenCalled();
    expect(spyReositroty.findOne).toHaveBeenCalledWith({
      where: { email: updateUser.email },
    });
    expect(spyReositroty.findOne).toHaveBeenCalled();
    expect(spyReositroty.findOne).toHaveBeenCalledWith({
      where: { nickname: updateUser.nickname },
    });

    expect(spyReositroty.update).toHaveBeenCalled();
    expect(spyReositroty.update).toHaveBeenCalledWith(user.id, updateUser);

    expect(spyReositroty.findOne).toHaveBeenCalled();
    expect(spyReositroty.findOne).toHaveBeenCalledWith({
      where: { id: user.id },
    });
    expect(result).toEqual(user);
  });
});

// async updateUser(userId: number, updateUser: UpdateUser): Promise<User> {
//   if (updateUser?.email) {
//     const user = await this.userRepository.findOne({
//       where: { email: updateUser.email },
//     });
//     if (user) {
//       throw new BadRequestException(['email 값이 중복됩니다.']);
//     }
//   }
//   if (updateUser?.nickname) {
//     const user = await this.userRepository.findOne({
//       where: { nickname: updateUser.nickname },
//     });
//     if (user) {
//       throw new BadRequestException(['nickname 값이 중복됩니다.']);
//     }
//   }
//   await this.userRepository.update(userId, updateUser);
//   return await this.userRepository.findOne({ where: { id: userId } });
// }
// async deleteUser(userId: number): Promise<boolean> {
//   const result: DeleteResult = await this.userRepository.delete(userId);
//   if (result.affected) {
//     return true;
//   }
//   return false;
// }
