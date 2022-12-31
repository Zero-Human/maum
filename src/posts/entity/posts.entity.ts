import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { UserOutput } from 'src/users/dto/user.dto';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
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

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  @Field(() => UserOutput)
  author: User;

  @CreateDateColumn({ name: 'created_at' })
  @Field(() => Date)
  createdAt: Date;
}
