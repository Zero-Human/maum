import { IsString } from 'class-validator';
import { Posts } from 'src/posts/entity/posts.entity';
import { UserOutput } from 'src/users/dto/user.dto';
import { User } from 'src/users/entity/user.entity';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  @IsString()
  content: string;

  @ManyToOne(() => User, { nullable: false })
  @Field(() => UserOutput)
  author: User;

  @CreateDateColumn({ name: 'created_at' })
  @Field(() => Date)
  createdAt: Date;

  @ManyToOne(() => Posts, (post) => post.comments)
  @Field(() => Posts)
  post: Posts;

  @ManyToOne(() => Comments, (comments) => comments.childComments)
  @Field(() => Comments, { nullable: true })
  parentComment: Comments;

  @OneToMany(() => Comments, (comments) => comments.parentComment)
  @Field(() => [Comments], { nullable: true })
  childComments: Comments[];
}
