import { Injectable } from '@nestjs/common';
import { MembersService } from '@members/members.service';

@Injectable()
export class StatsService {
  constructor(private readonly membersService: MembersService) {}

  /**
   * Get all members with birthday on a specific date
   * @param month - Month number (1-12). If not provided, uses current month
   * @param day - Day number (1-31). If not provided, uses current day
   * @returns Array of members with birthday on the specified date
   */
  async getBirthdayMembers(month?: number, day?: number) {
    return this.membersService.getBirthdayMembers(month, day);
  }
}
