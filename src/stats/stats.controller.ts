import { Controller, Get, Param, Query } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  /**
   * Get all members with birthday today
   * @returns Array of members with birthday today
   */
  @Get('birthday/:month/:day')
  async getBirthdayMembers(
    @Param('month') month: number,
    @Param('day') day: number,
  ) {
    const members = await this.statsService.getBirthdayMembers(month, day);

    return members;
  }
}
