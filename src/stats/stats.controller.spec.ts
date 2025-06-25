import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { MembersService } from '@members/members.service';
import { MEMBERS } from '@databases/seeds/mock/members';
import { Authorization } from '@common/guards/Authorization.guard';

describe('StatsController', () => {
  let controller: StatsController;
  let statsService: StatsService;

  const mockMembersService = {
    getBirthdayMembers: jest.fn(),
  };

  const mockAuthorizationGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
      providers: [
        StatsService,
        {
          provide: MembersService,
          useValue: mockMembersService,
        },
      ],
    })
      .overrideGuard(Authorization)
      .useValue(mockAuthorizationGuard)
      .compile();

    controller = module.get<StatsController>(StatsController);
    statsService = module.get<StatsService>(StatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call statsService.getBirthdayMembers when getBirthdayMembers is called', async () => {
    const month = 6;
    const day = 25;
    const expectedMembers = MEMBERS.filter((member) => {
      const birthDate = new Date(member.birthdate);
      return birthDate.getMonth() === 5 && birthDate.getDate() === 25;
    }) as any;

    jest
      .spyOn(statsService, 'getBirthdayMembers')
      .mockResolvedValue(expectedMembers);

    const result = await controller.getBirthdayMembers(month, day);

    expect(statsService.getBirthdayMembers).toHaveBeenCalledWith(month, day);
    expect(result).toEqual(expectedMembers);
    expect(expectedMembers.length).toBeGreaterThan(0);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return empty array when no members have birthday on given date', async () => {
    const month = 12;
    const day = 31;

    jest.spyOn(statsService, 'getBirthdayMembers').mockResolvedValue([]);

    const result = await controller.getBirthdayMembers(month, day);

    expect(statsService.getBirthdayMembers).toHaveBeenCalledWith(month, day);
    expect(result).toEqual([]);
  });
});
