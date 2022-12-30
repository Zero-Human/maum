import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { PostgreSQLConfigModule } from './config/config.module';
import { PostgreSQLConfigService } from './config/config.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      //graphql을 연결하기 위한 초기 설정 입니다.
      debug: true,
      playground: true,
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gpl',
      driver: ApolloDriver,
      context: ({ req, connection }) => {
        //graphql에게 request를 요청할때 req안으로 jwt토큰이 담깁니다.
        if (req) {
          //이부분이 처음 보시는 분들에게는 의아할 수 있습니다. graphql을 사용하면서 req.headers.authorization를 어떻게 담아서 보내는거지? 하실 수 있습니다. 해당 부분은 밑에 부분에서 설명하겠습니다.
          const user = req.headers.authorization;
          return { ...req, user };
        } else {
          return connection;
        }
      },
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
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [PostgreSQLConfigModule],
      useClass: PostgreSQLConfigService,
      inject: [PostgreSQLConfigService],
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
