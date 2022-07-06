import argon2 from 'argon2';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../entities/User';
import { MyContext } from '../types';
import { UserInput } from './user/UserInput';
import { UserResponse } from './user/UserResponse';
//@ts-ignore
import Long from 'graphql-type-long';
import { authentication } from '../firebaseConfig';
import { COOKIE_NAME } from '../constants';

@Resolver(User)
export class UserResolver {
  @Mutation(() => Boolean)
  async doesEmailExist(@Arg('email') email: string) {
    const user = await User.findOne({ where: { email } });
    if (user) {
      return true;
    }
    return false;
  }

  @Mutation(() => Boolean)
  async doesUsernameExist(@Arg('username') username: string) {
    const user = await User.findOne({ where: { username } });
    if (user) {
      return true;
    }
    return false;
  }

  @Mutation(() => Boolean)
  async doesPhoneNumberExist(
    @Arg('phonenumber', () => Long) phonenumber: number
  ) {
    const user = await User.findOne({ where: { phonenumber } });
    if (user) {
      return true;
    }
    return false;
  }

  // @Query(() => Boolean)
  // async phoneNumberVerification(
  //   @Arg('phonenumber', () => Int) phoneNumber: number
  // ) {
  //   const user = await User.findOne({ where: { phonenumber: phoneNumber } });
  //   if (user) {
  //     return true;
  //   }

  //   return false;
  // }

  @Mutation(() => UserResponse)
  async register(
    @Arg('input', () => UserInput) input: UserInput,
    @Ctx() { req }: MyContext
  ) {
    let user = await User.findOne({
      where: { phonenumber: input.phoneNumber },
    });
    if (user) {
      return {
        errors: true,
      };
    }
    user = await User.findOne({
      where: { username: input.username },
    });
    if (user) {
      return {
        errors: true,
      };
    }
    user = await User.findOne({
      where: { email: input.email },
    });
    if (user) {
      return {
        errors: true,
      };
    }
    const decodedToken = await authentication.verifyIdToken(input.idToken);
    const uid = decodedToken.uid;
    const userRecord = await authentication.getUser(uid);
    if (userRecord.phoneNumber) {
      if (
        input.phoneNumber === parseInt(userRecord.phoneNumber?.slice(4, 14))
      ) {
        const hashedPassword: string = await argon2.hash(input.password);
        const { email, firstname, lastname, phoneNumber, username, wardNo } =
          input;
        const user = await User.create({
          email,
          firstname,
          lastname,
          password: hashedPassword,
          phonenumber: phoneNumber,
          username,
          wardNo,
          isAdmin: false,
        }).save();
        if (user) {
          req.session.userId = user.id;
          return {
            errors: false,
            user: user,
          };
        }
        return {
          errors: true,
        };
      }
    }
    return {
      errors: true,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrNumber') usernameOrNumber: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ) {
    if (!usernameOrNumber) {
      return {
        errors: true,
      };
    }
    if (!password) {
      return {
        errors: true,
      };
    }
    let user = await User.findOne({ where: { username: usernameOrNumber } });
    if (!user) {
      user = await User.findOne({
        where: { phonenumber: parseInt(usernameOrNumber) },
      });

      if (!user) {
        return {
          errors: true,
        };
      }
    }
    const valid = await argon2.verify(user.password, password);

    if (valid) {
      req.session.userId = user.id;
      return {
        errors: false,
        user: user,
      };
    }

    return {
      errors: true,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    // you are not logged in
    if (!req.session.userId) {
      return null;
    }

    return User.findOne({ where: { id: req.session.userId } });
  }

  @Query(() => UserResponse, { nullable: true })
  async user(@Arg('id', () => Int) id: number): Promise<UserResponse> {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return {
        errors: true,
      };
    }
    return {
      user,
    };
  }
}
