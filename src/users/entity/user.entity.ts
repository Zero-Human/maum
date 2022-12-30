import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ unique: true })
  @Field(() => String)
  @IsEmail()
  email: string;

  @Column()
  @Field(() => String)
  @IsString()
  @MinLength(6)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '패스워드는 영문과 숫자로만 구성되어야 합니다.',
  })
  password: string;

  @Column({ unique: true })
  @Field(() => String)
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '닉네임은 영문과 숫자로만 구성되어야 합니다.',
  })
  nickname: string;
}
