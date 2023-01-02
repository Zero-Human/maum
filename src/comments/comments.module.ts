import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from 'src/posts/posts.module';
import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';
import { Comments } from './entity/comments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comments]), PostsModule],
  providers: [CommentsResolver, CommentsService],
})
export class CommentsModule {}
