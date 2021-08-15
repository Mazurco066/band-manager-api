// Dependencies
import { Module } from '@nestjs/common'
// Modules
import { AccountModule, InfraModule, AuthModule } from '@/main/modules'

@Module({
  imports: [
    InfraModule,
    AccountModule,
    AuthModule
  ]
})
export class MainModule {}