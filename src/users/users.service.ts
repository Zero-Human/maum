import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUser } from './dto/create-user.dto';
import { SignInInput } from './dto/signin.dto';
import { UpdateUser } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { Payload } from '../common/interface/payload.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async createUser(createUser: CreateUser): Promise<User> {
    const email = await this.userRepository.findOne({
      select: { email: true },
      where: { email: createUser.email },
    });
    if (email) {
      throw new BadRequestException(['email 값이 중복됩니다.']);
    }
    const nickname = await this.userRepository.findOne({
      select: { nickname: true },
      where: { nickname: createUser.nickname },
    });
    if (nickname) {
      throw new BadRequestException(['nickname 값이 중복됩니다.']);
    }
    const user = this.userRepository.create(createUser);
    return this.userRepository.save(user);
  }
  async signIn(signIn: SignInInput) {
    const { email, password } = signIn;
    const user = await this.userRepository.findOne({
      select: { id: true, password: true, email: true, nickname: true },
      where: { email },
    });
    if (!user) {
      throw new BadRequestException(['email 값이 잘못되었습니다.']);
    }
    if (user.password !== password) {
      throw new BadRequestException(['비밀번호 값이 잘못되었습니다.']);
    }
    const payload: Payload = {
      id: user.id,
      nickname: user.nickname,
    };
    return await this.jwtService.sign(payload);
  }
  async updateUser(userId: number, updateUser: UpdateUser): Promise<User> {
    if (updateUser?.email) {
      const user = await this.userRepository.findOne({
        where: { email: updateUser.email },
      });
      if (user) {
        throw new BadRequestException(['email 값이 중복됩니다.']);
      }
    }
    if (updateUser?.nickname) {
      const user = await this.userRepository.findOne({
        where: { nickname: updateUser.nickname },
      });
      if (user) {
        throw new BadRequestException(['nickname 값이 중복됩니다.']);
      }
    }
    await this.userRepository.update(userId, updateUser);
    return await this.userRepository.findOne({ where: { id: userId } });
  }
  async deleteUser(userId: number): Promise<boolean> {
    const result: DeleteResult = await this.userRepository.delete(userId);
    if (result.affected) {
      return true;
    }
    return false;
  }
}
