// Dependencies
import { Global, Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { CqrsModule } from '@nestjs/cqrs'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { GraphQLError } from 'graphql'
import { join } from 'path'

// Guards
import { GuardsResolvers } from '../guards'

// Envs
import { options } from '../config'

@Global()
@Module({
  imports: [
    CqrsModule,
    MongooseModule.forRoot(options.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      dbName: 'BandManagerProd'
    }),
    GraphQLModule.forRoot({
      playground: process.env.NODE_ENV !== 'production',
      autoSchemaFile: join(
        process.cwd(),
        'src/infra/graphql/schemas/schema.gql'
      ),
      formatError: (error: GraphQLError) => ({
        message: error.extensions?.exception?.response?.message || error.message
      })
    }),
    JwtModule.register({
      secret: options.SECRET,
      signOptions: { expiresIn: options.EXPIRATION }
    }),
    PassportModule
  ],
  providers: [...GuardsResolvers],
  exports: [CqrsModule, GraphQLModule, JwtModule, PassportModule]
})
export class InfraModule {}
