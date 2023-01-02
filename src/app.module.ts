import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { PostgreSQLConfigModule } from './config/config.module';
import { PostgreSQLConfigService } from './config/config.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      //graphql을 연결하기 위한 초기 설정 입니다.
      debug: true,
      playground: true,
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gpl',
      driver: ApolloDriver,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env' : '.env.test',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'test').required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_HOST: Joi.string().required(),
        DB_SCHEMA: Joi.string().required(),
        SYNCHRONIZE: Joi.boolean().required(),
        LOGGING: Joi.boolean().required(),
        SECRET_KEY: Joi.string().required(),
        EXPIRES_IN: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [PostgreSQLConfigModule],
      useClass: PostgreSQLConfigService,
      inject: [PostgreSQLConfigService],
    }),
    UsersModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
