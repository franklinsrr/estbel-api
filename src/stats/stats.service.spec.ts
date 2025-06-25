import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from './stats.service';
import { MembersService } from '@members/members.service';
import { MEMBERS } from '@databases/seeds/mock/members';

describe('StatsService', () => {
  let service: StatsService;
  let membersService: MembersService;

  const mockMembersService = {
    getBirthdayMembers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        {
          provide: MembersService,
          useValue: mockMembersService,
        },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
    membersService = module.get<MembersService>(MembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call membersService.getBirthdayMembers when getBirthdayMembers is called', async () => {
    const month = 6;
    const day = 25;
    const expectedMembers = MEMBERS.filter((member) => {
      const birthDate = new Date(member.birthdate);
      return birthDate.getMonth() === 5 && birthDate.getDate() === 25;
    }) as any;

    mockMembersService.getBirthdayMembers.mockResolvedValue(expectedMembers);

    const result = await service.getBirthdayMembers(month, day);

    expect(membersService.getBirthdayMembers).toHaveBeenCalledWith(month, day);
    expect(result).toEqual(expectedMembers);
  });

  it('should pass undefined parameters to membersService when no parameters provided', async () => {
    const expectedMembers = [] as any;
    mockMembersService.getBirthdayMembers.mockResolvedValue(expectedMembers);

    const result = await service.getBirthdayMembers();

    expect(membersService.getBirthdayMembers).toHaveBeenCalledWith(
      undefined,
      undefined,
    );
    expect(result).toEqual(expectedMembers);
  });
});
