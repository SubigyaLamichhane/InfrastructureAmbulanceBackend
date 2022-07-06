import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Complain } from './Complain';
//@ts-ignore
import Long from 'graphql-type-long';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = new Date();

  @Field(() => String)
  @Column({ type: 'text', unique: true })
  username!: string;

  @Column({ type: 'text' })
  password!: string;

  @Field(() => String)
  @Column({ type: 'text', unique: true })
  email!: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  wardNo!: number;

  @Field(() => String)
  @Column({ type: 'text' })
  firstname!: string;

  @Field(() => String)
  @Column({ type: 'text' })
  lastname!: string;

  @Field(() => Long)
  @Column({ type: 'bigint' })
  phonenumber!: number;

  @OneToMany(() => Complain, (complain) => complain.creator)
  complaints: Complain[];

  @Field(() => Boolean)
  @Column({ type: 'boolean' })
  isAdmin: Boolean;
}
