import { User } from '../../entities/User';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class UserResponse {
  @Field(() => Boolean, { nullable: true })
  errors?: true;

  @Field(() => User, { nullable: true })
  user?: User;
}
