import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Posts } from 'src/posts/entity/posts.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ unique: true })
  @Field(() => String, { description: '이메일 형식입니다. 고유한 값입니다.' })
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field(() => String, { description: '최소 6자 이상입니다.' })
  @IsString()
  @MinLength(6)
  password: string;

  @Column({ unique: true })
  @Field(() => String, { description: '4~20자까지 가능합니다.' })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  nickname: string;

  @OneToMany(() => Posts, (posts) => posts.author, { nullable: true })
  posts: Posts[];
}
