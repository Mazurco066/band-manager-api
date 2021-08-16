// Dependencies
import { Module } from '@nestjs/common'
// Modules
import { AccountModule, InfraModule, AuthModule, BandModule, SongModule, ShowModule } from '@/main/modules'

@Module({
  imports: [
    InfraModule,
    AccountModule,
    AuthModule,
    BandModule,
    SongModule,
    ShowModule
  ]
})
export class MainModule {}