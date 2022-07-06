import { InputType, Field, Int, Float } from 'type-graphql';

@InputType()
export class ComplainInput {
  @Field()
  title: string;
  @Field()
  description: string;
  @Field()
  category: string;
  @Field(() => Int)
  wardNo: number;
  @Field(() => Float)
  latitude: number;
  @Field(() => Float)
  longitude: number;
  @Field()
  imagePublicId: string;
}
