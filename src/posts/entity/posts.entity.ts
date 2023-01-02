import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Comments } from 'src/comments/entity/comments.entity';
import { UserOutput } from 'src/users/dto/user.dto';
import { User } from 'src/users/entity/user.entity';
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
  @Field(() => String)
  @IsString()
  title: string;

  @Column()
  @Field(() => String)
  @IsString()
  content: string;

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @Field(() => UserOutput)
  author: User;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  @Field(() => Date)
  createdAt: Date;

  @OneToMany(() => Comments, (comment) => comment.post)
  @Field(() => [Comments], { nullable: true })
  comments: Comments[];
}
