import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { MembersModule } from '@members/members.module';

@Module({
  controllers: [StatsController],
  providers: [StatsService],
  imports: [MembersModule],
})
export class StatsModule {}
