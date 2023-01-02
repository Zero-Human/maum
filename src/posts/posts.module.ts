import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './entity/posts.entity';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Posts])],
  providers: [PostsResolver, PostsService],
  exports: [PostsService],
})
export class PostsModule {}
