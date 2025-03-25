import assert from 'node:assert';

import { gqlFetcherFactory } from '@affine/graphql';
import { INestApplication } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import supertest from 'supertest';

import {
  AFFiNELogger,
  CacheInterceptor,
  CloudThrottlerGuard,
  GlobalExceptionFilter,
  JobQueue,
  OneMB,
} from '../../base';
import { SocketIoAdapter } from '../../base/websocket';
import { AuthGuard, AuthService } from '../../core/auth';
import { Mailer } from '../../core/mail';
import {
  createFactory,
  MockedUser,
  MockJobQueue,
  MockMailer,
  MockUser,
  MockUserInput,
} from '../mocks';
import { parseCookies, TEST_LOG_LEVEL } from '../utils';

interface TestingAppMetadata {
  tapModule?(m: TestingModuleBuilder): void;
  tapApp?(app: INestApplication): void;
}

export class TestingApp extends NestApplication {
  private sessionCookie: string | null = null;
  private currentUserCookie: string | null = null;
  private readonly userCookies: Set<string> = new Set();

  create = createFactory(this.get(PrismaClient, { strict: false }));
  mails = this.get(Mailer, { strict: false }) as MockMailer;
  queue = this.get(JobQueue, { strict: false }) as MockJobQueue;

  get url() {
    const server = this.getHttpServer();
    if (!server.address()) {
      server.listen();
    }
    return `http://localhost:${server.address().port}`;
  }

  async [Symbol.asyncDispose]() {
    await this.close();
  }

  request(
    method: 'options' | 'get' | 'post' | 'put' | 'delete' | 'patch',
    path: string
  ): supertest.Test {
    return supertest(this.getHttpServer())
      [method](path)
      .set('Cookie', [
        `${AuthService.sessionCookieName}=${this.sessionCookie ?? ''}`,
        `${AuthService.userCookieName}=${this.currentUserCookie ?? ''}`,
      ]);
  }

  gql = gqlFetcherFactory('', async (_input, init) => {
    assert(init, 'no request content');
    assert(init.body, 'body is required for gql request');
    assert(init.headers, 'headers is required for gql request');

    const res = await this.request('post', '/graphql')
      .send(init?.body)
      .set('accept', 'application/json')
      .set(init.headers as Record<string, string>);

    return new Response(Buffer.from(JSON.stringify(res.body)), {
      status: res.status,
      headers: res.headers,
    });
  });

  OPTIONS(path: string): supertest.Test {
    return this.request('options', path);
  }

  GET(path: string): supertest.Test {
    return this.request('get', path);
  }

  POST(path: string): supertest.Test {
    return this.request('post', path).on(
      'response',
      (res: supertest.Response) => {
        const cookies = parseCookies(res);

        if (AuthService.sessionCookieName in cookies) {
          if (this.sessionCookie !== cookies[AuthService.sessionCookieName]) {
            this.userCookies.clear();
          }

          this.sessionCookie = cookies[AuthService.sessionCookieName];
          this.currentUserCookie = cookies[AuthService.userCookieName];
          if (this.currentUserCookie) {
            this.userCookies.add(this.currentUserCookie);
          }
        }
        return res;
      }
    );
  }

  PUT(path: string): supertest.Test {
    return this.request('put', path);
  }

  DELETE(path: string): supertest.Test {
    return this.request('delete', path);
  }

  PATCH(path: string): supertest.Test {
    return this.request('patch', path);
  }

  async createUser(overrides?: Partial<MockUserInput>) {
    return await this.create(MockUser, overrides);
  }

  async signup(overrides?: Partial<MockUserInput>) {
    const user = await this.create(MockUser, overrides);
    await this.login(user);
    return user;
  }

  async login(user: MockedUser) {
    await this.POST('/api/auth/sign-in')
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(200);
  }

  async switchUser(userOrId: string | { id: string }) {
    if (!this.sessionCookie) {
      throw new Error('No user is logged in.');
    }

    const userId = typeof userOrId === 'string' ? userOrId : userOrId.id;

    if (userId === this.currentUserCookie) {
      return;
    }

    if (this.userCookies.has(userId)) {
      this.currentUserCookie = userId;
    } else {
      throw new Error(`User [${userId}] is not logged in.`);
    }
  }

  async logout(userId?: string) {
    const res = await this.GET(
      '/api/auth/sign-out' + (userId ? `?user_id=${userId}` : '')
    ).expect(200);
    const cookies = parseCookies(res);
    this.sessionCookie = cookies[AuthService.sessionCookieName];
    if (!this.sessionCookie) {
      this.currentUserCookie = null;
      this.userCookies.clear();
    } else {
      this.currentUserCookie = cookies[AuthService.userCookieName];
      if (userId) {
        this.userCookies.delete(userId);
      }
    }
  }
}

let GLOBAL_APP_INSTANCE: TestingApp | null = null;
export async function createApp(
  metadata: TestingAppMetadata = {}
): Promise<TestingApp> {
  if (GLOBAL_APP_INSTANCE) {
    return GLOBAL_APP_INSTANCE;
  }

  const { buildAppModule } = await import('../../app.module');
  const { tapModule, tapApp } = metadata;

  const builder = Test.createTestingModule({
    imports: [buildAppModule()],
  });

  builder.overrideProvider(Mailer).useValue(new MockMailer());
  builder.overrideProvider(JobQueue).useValue(new MockJobQueue());

  // when custom override happens
  if (tapModule) {
    tapModule(builder);
  }

  const module = await builder.compile();

  module.useCustomApplicationConstructor(TestingApp);

  const app = module.createNestApplication<TestingApp>({
    cors: true,
    bodyParser: true,
    rawBody: true,
  });

  const logger = new AFFiNELogger();
  logger.setLogLevels([TEST_LOG_LEVEL]);
  app.useLogger(logger);
  app.use(cookieParser());
  app.useBodyParser('raw', { limit: 1 * OneMB });
  app.use(
    graphqlUploadExpress({
      maxFileSize: 10 * OneMB,
      maxFiles: 5,
    })
  );

  app.useGlobalGuards(app.get(AuthGuard), app.get(CloudThrottlerGuard));
  app.useGlobalInterceptors(app.get(CacheInterceptor));
  app.useGlobalFilters(new GlobalExceptionFilter(app.getHttpAdapter()));

  const adapter = new SocketIoAdapter(app);
  app.useWebSocketAdapter(adapter);
  app.enableShutdownHooks();

  if (tapApp) {
    tapApp(app);
  }

  await app.init();

  GLOBAL_APP_INSTANCE = app;
  return app;
}
