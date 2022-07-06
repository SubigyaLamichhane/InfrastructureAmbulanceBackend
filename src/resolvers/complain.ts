import { MyContext } from 'src/types';
import { isAuth } from '../utils/middleware/isAuth';
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { Complain } from '../entities/Complain';
import { dataSource } from '../dataSource';
import { ComplainInput } from './complain/ComplainInput';
import { User } from '../entities/User';

@ObjectType()
class PaginatedComplains {
  @Field(() => [Complain])
  complains: Complain[];

  @Field()
  hasMore: boolean;
}

@ObjectType()
class CreatorUserResponse {
  @Field({ nullable: true })
  error?: 'The creator of this post has deleted their account for some reason';
  @Field({ nullable: true })
  user?: User;
}

@Resolver(Complain)
export class ComplainResolver {
  @FieldResolver()
  descriptionSnippet(@Root() root: Complain): String {
    return root.description.slice(0, 50);
  }

  @FieldResolver(() => CreatorUserResponse)
  async user(@Root() root: Complain): Promise<CreatorUserResponse> {
    const user = await User.findOne({
      where: { id: root.creatorId },
    });
    if (!user) {
      return {
        error:
          'The creator of this post has deleted their account for some reason',
      };
    }
    return {
      user,
    };
  }

  @Query(() => PaginatedComplains)
  async complains(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
    @Arg('wardNo', () => Int, { nullable: true }) wardNo: number | null
  ): Promise<PaginatedComplains> {
    const realLimit = limit >= 50 ? 50 : limit;
    const realLimitPlusOne = realLimit + 1;

    const complain = dataSource
      .getRepository(Complain)
      .createQueryBuilder('p')
      //.innerJoinAndSelect('p.creator', 'u', 'u.id = p."creatorId"')
      .orderBy('"createdAt"', 'DESC') // if we dont put double quotes the A will be lowecased and error
      .take(realLimitPlusOne);
    if (cursor) {
      complain.where('p."createdAt" < :cursor', {
        cursor: new Date(parseInt(cursor)),
      });
    }
    if (wardNo) {
      complain.where('p."wardNo" = :wardNo', {
        wardNo,
      });
    }

    const complains = await complain.getMany();

    const complainsWithHasMore = {
      complains: complains.slice(0, realLimit),
      hasMore: complains.length === realLimitPlusOne,
    };

    return complainsWithHasMore;
  }

  @Query(() => PaginatedComplains)
  async complainsByUser(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
    @Arg('userId', () => Int) userId: number
  ): Promise<PaginatedComplains> {
    const realLimit = limit >= 50 ? 50 : limit;
    const realLimitPlusOne = realLimit + 1;

    const complain = dataSource
      .getRepository(Complain)
      .createQueryBuilder('p')
      //.innerJoinAndSelect('p.creator', 'u', 'u.id = p."creatorId"')
      .orderBy('"createdAt"', 'DESC') // if we dont put double quotes the A will be lowecased and error
      .take(realLimitPlusOne);
    if (cursor) {
      complain.where('p."createdAt" < :cursor', {
        cursor: new Date(parseInt(cursor)),
      });
    }
    complain.where('p."creatorId" = :userId', {
      userId,
    });
    const complains = await complain.getMany();

    const complainsWithHasMore = {
      complains: complains.slice(0, realLimit),
      hasMore: complains.length === realLimitPlusOne,
    };

    return complainsWithHasMore;
  }

  @Query(() => Complain, { nullable: true })
  complain(@Arg('id', () => Int) id: number): Promise<Complain | null> {
    return Complain.findOne({ where: { id } });
  }

  @Mutation(() => Complain)
  @UseMiddleware(isAuth)
  async createComplain(
    @Arg('input') input: ComplainInput,
    @Ctx() { req }: MyContext
  ): Promise<Complain> {
    const complain = await Complain.create({
      ...input,
      creatorId: req.session.userId,
    }).save();

    return complain;
  }

  @Mutation(() => Complain, { nullable: true })
  async updateComplain(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String, { nullable: true }) title: string
  ): Promise<Complain | null> {
    const post = await Complain.findOne({ where: { id } });
    if (!post) {
      return null;
    }
    if (typeof title !== 'undefined') {
      await Complain.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deleteComplain(@Arg('id') id: number): Promise<boolean> {
    try {
      await Complain.delete(id);
    } catch {
      return false;
    }
    return true;
  }
}
