import 'reflect-metadata';
import 'dotenv-safe/config';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';

import { buildSchema } from 'type-graphql';
import { COOKIE_NAME, __prod__ } from './constants';
import { dataSource } from './dataSource';
import { ComplainResolver } from './resolvers/complain';
import { UserResolver } from './resolvers/user';
//import argon2 from 'argon2';

const main = async () => {
  await dataSource.initialize();
  //await dataSource.runMigrations();

  //await Post.delete({});

  // const hashedPassword = await argon2.hash('admin');
  // await dataSource.query(
  //   `
  //   insert into public.user(username, password, email, "isAdmin")
  //   values ('ADMIN', $1, 'kecthoughts@admin.com', true)
  //   `,
  //   [hashedPassword]
  // );

  const app = express();

  let RedisStore = connectRedis(session);
  let redis = new Redis({
    host: process.env.REDIS_URL,
    port: 12967,
    username: 'default',
    password: process.env.REDIS_PASSWORD,
  });

  //applies cors is all routes
  app.set('trust proxy', 1);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
        httpOnly: true,
        secure: __prod__, //cookie only works in https
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
      },
      saveUninitialized: false,
      secret: 'avneoanveoanveanveoanevoa',
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ComplainResolver, UserResolver],
      validate: false,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: ({ req, res }) => ({ req, res, redis }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    //cors: { origin: 'http://localhost:3000' }, //do this to only use it in apollo but we are going to set is globally
    cors: false,
  });

  app.get('/', (_, res) => {
    res.send('Hello');
  });

  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
};

main();
