import { forwardRef, Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { MembersModule } from '@members/members.module';
import { AdminsModule } from '@admins/admins.module';
import { AuthModule } from '@auth/auth.module';

@Module({
  controllers: [StatsController],
  providers: [StatsService],
  imports: [
    MembersModule,
    forwardRef(() => AuthModule),
    forwardRef(() => AdminsModule),
    AuthModule,
  ],
})
export class StatsModule {}
