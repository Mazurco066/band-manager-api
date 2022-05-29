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
    PassportModule,
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
    // * Uncomment this if you wish to use SMTP E-mail servers
    // MailerModule.forRoot({
    //   transport: {
    //     host: options.SENDGRID_HOST,
    //     port: options.SENDGRID_PORT,
    //     secure: options.SENDGRID_PORT === 465,
    //     auth: {
    //       user: options.SENDGRID_USER,
    //       pass: options.SENDGRID_KEY
    //     }
    //   },
    //   defaults: {
    //     from: `"No Reply" <${options.MAIL_USER}>`
    //   },
    //   template: {
    //     dir: join(process.cwd(), 'dist/assets/templates'),
    //     adapter: new PugAdapter(),
    //     options: {
    //       strict: true
    //     }
    //   }
    // })
  ],
  providers: [...GuardsResolvers],
  exports: [CqrsModule, GraphQLModule, JwtModule, PassportModule]
})
export class InfraModule {}
