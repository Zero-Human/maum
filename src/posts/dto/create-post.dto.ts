import { PickType, InputType } from '@nestjs/graphql';
import { Posts } from '../entity/posts.entity';

@InputType()
export class CreatePost extends PickType(Posts, ['title', 'content']) {}
