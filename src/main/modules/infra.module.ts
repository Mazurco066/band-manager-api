// Dependencies
import { Global, Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

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
    JwtModule.register({
      secret: options.SECRET,
      signOptions: { expiresIn: options.EXPIRATION }
    })
  ],
  providers: [...GuardsResolvers],
  exports: [CqrsModule, JwtModule, PassportModule]
})
export class InfraModule {}
