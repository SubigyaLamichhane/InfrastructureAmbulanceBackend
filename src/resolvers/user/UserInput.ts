import { InputType, Field, Int } from 'type-graphql';
//@ts-ignore
import Long from 'graphql-type-long';

@InputType()
export class UserInput {
  @Field()
  username: string;
  @Field()
  password: string;
  @Field(() => Int)
  wardNo: number;
  @Field()
  firstname: string;
  @Field()
  lastname: string;
  @Field()
  email: string;
  @Field(() => Long)
  phoneNumber: number;
  @Field()
  idToken: string;
}
