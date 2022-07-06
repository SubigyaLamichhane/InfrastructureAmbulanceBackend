import { Field, Float, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity()
export class Complain extends BaseEntity {
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
  @Column({ type: 'text' })
  title!: string;

  @Field()
  @Column()
  description!: string;

  @Field(() => String)
  @Column({ type: 'text' })
  category!: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  wardNo: number;

  @Field(() => Float)
  @Column({ type: 'float' })
  latitude: number;

  @Field(() => Float)
  @Column({ type: 'float' })
  longitude: number;

  @Field()
  @ManyToOne(() => User, (user) => user.complaints)
  creator: User;

  @Field()
  @Column()
  creatorId!: number;

  @Field()
  @Column()
  imagePublicId: string;
}
