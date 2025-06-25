import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { MemberStatusService } from '@memberStatus/member-status.service';
import { IQueryParams } from '@common/interfaces/decorators';
import { Member } from '@members/entities/member.entity';
import { CivilStatus } from '@members/enum/options';
import { CreateMemberDto } from '@members/dto/create-member.dto';
import { UpdateMemberDto } from '@members/dto/update-member.dto';
import { CURRENT_DAY, CURRENT_MONTH } from '@shared/constants/birthday';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly memberStatusService: MemberStatusService,
  ) {}

  /**
   * Creates a new member and saves it in the database.
   * @param {CreateMemberDto} createMemberDto - the data transfer object for creating a member.
   * @returns {CreateMemberDto} the created member.
   */
  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const { memberStatusId, spouseId, childIds, parentIds, ...memberData } =
      createMemberDto;

    const member = this.memberRepository.create(memberData);

    member.memberStatus = await this.memberStatusService.findOne(
      memberStatusId,
    );

    if (spouseId) {
      member.spouse = await this.findMember(spouseId, 'Spouse');
    }

    if (parentIds) {
      member.parents = await this.findMembersByIds(parentIds);
    }

    if (childIds) {
      member.children = await this.findMembersByIds(childIds);
    }

    return this.memberRepository.save(member);
  }

  /**
   * Finds all members based on query parameters.
   * @param {IQueryParams} queryParams - Query parameters for filtering and sorting members.
   * @returns {Promise<Member>} An array of the members.
   */
  async findAll(queryParams: IQueryParams): Promise<Member[]> {
    return this.memberRepository.find(queryParams);
  }

  /**
   * Retrieves all the members that match the provided query parameters.
   * @param {string} id - The ID of the member to retrieve.
   */
  async findOne(id: string): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: { id },
      relations: ['parents', 'children', 'spouse'],
    });

    if (!member) {
      throw new NotFoundException(`Member with id: ${id} not found`);
    }

    return member;
  }

  /**
   * Get all members with birthday on a specific date
   * @param month - Month number (1-12). If not provided, uses current month
   * @param day - Day number (1-31). If not provided, uses current day
   * @returns Array of members with birthday on the specified date
   */
  async getBirthdayMembers(month?: number, day?: number) {
    const targetMonth = month || parseInt(CURRENT_MONTH);
    const targetDay = day || parseInt(CURRENT_DAY);

    const members = await this.memberRepository
      .createQueryBuilder('member')
      .where(
        `EXTRACT(MONTH FROM member.birthdate::date) = :month AND EXTRACT(DAY FROM member.birthdate::date) = :day`,
        {
          month: targetMonth,
          day: targetDay,
        },
      )
      .orderBy('member.birthdate', 'ASC')
      .getMany();

    return members;
  }

  /**
   * Debug method to check how dates are stored in database
   * @returns Debug information about dates
   */
  async debugBirthDates() {
    // Buscar específicamente los miembros que deberían tener fecha 25 de junio
    const june25Members = await this.memberRepository
      .createQueryBuilder('member')
      .select([
        'member.id',
        'member.firstName',
        'member.lastName',
        'member.birthdate',
      ])
      .where(`member.birthdate::text LIKE '%25%'`)
      .getMany();

    // Buscar miembros con nombres específicos que sabemos que deberían tener fecha 25 de junio
    const specificMembers = await this.memberRepository
      .createQueryBuilder('member')
      .select([
        'member.id',
        'member.firstName',
        'member.lastName',
        'member.birthdate',
      ])
      .where(`member.firstName IN ('Roberto', 'Fernando', 'Andrés')`)
      .getMany();

    // Buscar todos los miembros que contienen "25" en su fecha
    const allMembers = await this.memberRepository
      .createQueryBuilder('member')
      .select([
        'member.id',
        'member.firstName',
        'member.lastName',
        'member.birthdate',
      ])
      .where('member.birthdate IS NOT NULL')
      .limit(50)
      .getMany();

    const debugInfo = {
      currentDate: new Date(),
      currentMonth: parseInt(CURRENT_MONTH),
      currentDay: parseInt(CURRENT_DAY),
      june25Members: june25Members.map((member) => ({
        name: `${member.firstName} ${member.lastName}`,
        birthdate: member.birthdate,
        parsed: member.birthdate ? new Date(member.birthdate) : null,
        month: member.birthdate
          ? new Date(member.birthdate).getMonth() + 1
          : null,
        day: member.birthdate ? new Date(member.birthdate).getDate() : null,
      })),
      specificMembers: specificMembers.map((member) => ({
        name: `${member.firstName} ${member.lastName}`,
        birthdate: member.birthdate,
        parsed: member.birthdate ? new Date(member.birthdate) : null,
        month: member.birthdate
          ? new Date(member.birthdate).getMonth() + 1
          : null,
        day: member.birthdate ? new Date(member.birthdate).getDate() : null,
      })),
      totalMembers: allMembers.length,
      allDates: allMembers.map((member) => ({
        name: `${member.firstName} ${member.lastName}`,
        birthdate: member.birthdate,
        month: member.birthdate
          ? new Date(member.birthdate).getMonth() + 1
          : null,
        day: member.birthdate ? new Date(member.birthdate).getDate() : null,
      })),
    };

    return debugInfo;
  }

  /**
   * Updates an existing module by its ID
   * @param {string} id - The ID of the member to update
   * @param {UpdateMemberDto} updateMemberDto - the data transfer object for update a member.
   * @throws {NotFoundException} if no member with the given ID is found.
   * @returns {Promise<Member>} The result of the update operation.
   */
  async update(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const member = await this.findOne(id);

    const { memberStatusId, spouseId, childIds, parentIds, ...memberData } =
      updateMemberDto;

    Object.assign(member, memberData);

    if (memberStatusId) {
      member.memberStatus = await this.memberStatusService.findOne(
        memberStatusId,
      );
    }

    if (spouseId) {
      member.spouse = await this.findMember(spouseId, 'Spouse');
    }

    if (member.civilStatus === CivilStatus.DIVORCED) {
      member.spouse = null;
    }

    if (parentIds) {
      member.parents = await this.findMembersByIds(parentIds);
    }

    if (childIds) {
      member.children = await this.findMembersByIds(childIds);
    }

    return this.memberRepository.save(member);
  }

  /**
   * Deletes a member by its ID.
   * @param {string} id - The ID of the member to delete.
   * @throws {NotFoundException} if no member with the given ID is found.
   * @returns {Promise<DeleteResult>} A promise indicating the completion of the delete operation.
   */
  async remove(id: string): Promise<DeleteResult> {
    await this.findOne(id);
    return await this.memberRepository.delete(id);
  }

  /**
   * Retrieves a single member by its ID
   * @param {string} id - The ID of the member to retrieve.
   * @throws {NotFoundException} If no module with the given ID is found with an relation information.
   * @returns {Promise<Member>} The retrieved member
   */
  private async findMember(id: string, relation: string): Promise<Member> {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException(`${relation} with id: ${id} not found`);
    }
    return member;
  }

  /**
   * Retrieves members that match the IDs.
   * @param {string[]} ids - The ids of the members to retrieve.
   * @returns {Promise<Member>} An array of member.
   */
  async findMembersByIds(ids: string[]): Promise<Member[]> {
    return this.memberRepository.findBy({ id: In(ids) });
  }
}
