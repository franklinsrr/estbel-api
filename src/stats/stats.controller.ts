import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { Authorization } from '@common/guards/Authorization.guard';
import { MODULES } from '@shared/enums/modules';
import { PERMISSIONS } from '@shared/enums/permissions';
import { AuthPermission } from '@common/decorators/auth-permission.decorator';

@Controller('stats')
@UseGuards(Authorization)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  /**
   * Get all members with birthday today
   * @returns Array of members with birthday today
   */
  @Get('birthday/:month/:day')
  @AuthPermission(MODULES.MEMBERS, PERMISSIONS.READ)
  async getBirthdayMembers(
    @Param('month') month: number,
    @Param('day') day: number,
  ) {
    const members = await this.statsService.getBirthdayMembers(month, day);

    return members;
  }
}
