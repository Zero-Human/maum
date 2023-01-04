import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsString, MaxLength } from 'class-validator';
import { Comments } from 'src/comments/entity/comments.entity';
import { UserOutput } from 'src/users/dto/user.dto';
import { User } from '../../users/entity/user.entity';
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
export class Posts {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String, { description: '최대 100자까지 가능합니다.' })
  @MaxLength(100)
  @IsString()
  title: string;

  @Column()
  @Field(() => String, { description: '최대 1000자까지 가능합니다.' })
  @MaxLength(1000)
  @IsString()
  content: string;

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @Field(() => UserOutput, { description: '작성자 정보' })
  author: User;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field(() => Date, { nullable: true, description: '수정 시간' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  @Field(() => Date, { description: '생성 시간' })
  createdAt: Date;

  @OneToMany(() => Comments, (comment) => comment.post)
  @Field(() => [Comments], { nullable: true, description: '댓글 정보' })
  comments: Comments[];
}
