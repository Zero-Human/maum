import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Comments } from 'src/comments/entity/comments.entity';
import { Posts } from 'src/posts/entity/posts.entity';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class PostgreSQLConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      port: this.configService.get<number>('DB_PORT'),
      host: this.configService.get<string>('DB_HOST'),
      database: this.configService.get<string>('DB_SCHEMA'),
      entities: [User, Posts, Comments],
      synchronize: Boolean(this.configService.get<boolean>('SYNCHRONIZE')),
      logging: Boolean(this.configService.get<boolean>('LOGGING')),
    };
  }
}
