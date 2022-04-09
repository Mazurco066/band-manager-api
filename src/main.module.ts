// Dependencies
import { Module } from '@nestjs/common'

// Modules
import {
  AccountModule,
  InfraModule,
  AuthModule,
  BandModule,
  HelperModule,
  SongModule,
  ShowModule
} from '@/main/modules'

// Controllers
import { MainController } from './main.controller'

@Module({
  imports: [
    InfraModule,
    AccountModule,
    AuthModule,
    BandModule,
    HelperModule,
    SongModule,
    ShowModule
  ],
  controllers: [ MainController ]
})
export class MainModule {}