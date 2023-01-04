import { IsString, MaxLength } from 'class-validator';
import { Posts } from '../../posts/entity/posts.entity';
import { UserOutput } from 'src/users/dto/user.dto';
import { User } from '../..//users/entity/user.entity';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String, { description: '최대 1000자까지 가능합니다' })
  @MaxLength(1000)
  @IsString()
  content: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @Field(() => UserOutput, { description: '작성자 정보' })
  author: User;

  @CreateDateColumn({ name: 'created_at' })
  @Field(() => Date, { description: '생성 시간' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field(() => Date, { nullable: true, description: '수정 시간' })
  updatedAt: Date;

  @ManyToOne(() => Posts, (post) => post.comments, {
    onDelete: 'CASCADE',
  })
  @Field(() => Posts, { description: '게시글 정보' })
  post: Posts;

  @ManyToOne(() => Comments, (comments) => comments.childComments, {
    onDelete: 'CASCADE',
  })
  @Field(() => Comments, { nullable: true, description: '상위 댓글 정보' })
  parentComment: Comments;

  @OneToMany(() => Comments, (comments) => comments.parentComment)
  @Field(() => [Comments], { nullable: true, description: '하위 댓글 정보' })
  childComments: Comments[];
}
