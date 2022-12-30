import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const user = this.userRepository.create(createUser);
    return this.userRepository.save(user);
  }
  async signIn(signIn: SignInInput) {
    const { email, password } = signIn;
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      //TODO: error 발생
    }
    if (user.password !== password) {
      //TODO: error 발생
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
        //TODO: error 발생(email 중복)
      }
    }
    if (updateUser?.nickname) {
      const user = await this.userRepository.findOne({
        where: { nickname: updateUser.nickname },
      });
      if (user) {
        //TODO: error 발생(nickname 중복)
      }
    }
    await this.userRepository.update(userId, updateUser);
    return await this.userRepository.findOne({ where: { id: userId } });
  }
}
