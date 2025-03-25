import './config';

import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo';
import { Global, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Request, Response } from 'express';

import { Config } from '../config';
import { mapAnyError } from '../nestjs/exception';
import { GQLLoggerPlugin } from './logger-plugin';

export type GraphqlContext = {
  req: Request;
  res: Response;
  isAdminQuery: boolean;
};

@Global()
@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (config: Config) => {
        return {
          ...config.graphql,
          path: `${config.server.path}/graphql`,
          csrfPrevention: {
            requestHeaders: ['content-type'],
          },
          autoSchemaFile: join(
            fileURLToPath(import.meta.url),
            config.node.dev
              ? '../../../schema.gql'
              : '../../../../node_modules/.cache/schema.gql'
          ),
          sortSchema: true,
          context: ({
            req,
            res,
          }: {
            req: Request;
            res: Response;
          }): GraphqlContext => ({
            req,
            res,
            isAdminQuery: false,
          }),
          plugins: [new GQLLoggerPlugin()],
          formatError: (formattedError, error) => {
            let ufe = mapAnyError(error);

            // @ts-expect-error allow assign
            formattedError.extensions = ufe.toJSON();
            if (config.affine.canary) {
              formattedError.extensions.stacktrace = ufe.stacktrace;
            }
            return formattedError;
          },
        };
      },
      inject: [Config],
    }),
  ],
})
export class GqlModule {}

export * from './pagination';
export { registerObjectType } from './register';
