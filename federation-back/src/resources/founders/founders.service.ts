import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFounderDto } from './dto/create-founder.dto';
import { UpdateFounderDto } from './dto/update-founder.dto';

@Injectable()
export class FoundersService {
  constructor(private readonly prisma: PrismaService) {}

  private validateFounderData(dto: CreateFounderDto | UpdateFounderDto, type: string) {
    if (type === 'INDIVIDUAL') {
      if (!dto.firstName?.trim()) throw new BadRequestException('სახელი სავალდებულოა');
      if (!dto.lastName?.trim()) throw new BadRequestException('გვარი სავალდებულოა');
      if (!dto.phone?.trim()) throw new BadRequestException('ტელეფონი სავალდებულოა');
      if (!dto.email?.trim()) throw new BadRequestException('ელ. ფოსტა სავალდებულოა');
      if (!dto.personalId || !/^\d{11}$/.test(dto.personalId)) {
        throw new BadRequestException('პირადი ნომერი უნდა შედგებოდეს 11 ციფრისგან');
      }
    } else if (type === 'LEGAL_ENTITY') {
      if (!dto.companyName?.trim()) throw new BadRequestException('კომპანიის დასახელება სავალდებულოა');
      if (!dto.companyCode || !/^\d{9}$/.test(dto.companyCode)) {
        throw new BadRequestException('საიდენტიფიკაციო კოდი უნდა შედგებოდეს 9 ციფრისგან');
      }
      if (!dto.representativeName?.trim()) throw new BadRequestException('წარმომადგენლის სახელი და გვარი სავალდებულოა');
      if (!dto.representativePersonalId || !/^\d{11}$/.test(dto.representativePersonalId)) {
        throw new BadRequestException('წარმომადგენლის პირადი ნომერი უნდა შედგებოდეს 11 ციფრისგან');
      }
    } else {
      throw new BadRequestException('დამფუძნებლის ტიპი არასწორია');
    }
  }

  async findAll(companyId: string) {
    return this.prisma.founder.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, companyId: string) {
    const founder = await this.prisma.founder.findUnique({
      where: { id },
    });
    if (!founder || founder.companyId !== companyId) {
      throw new NotFoundException('დამფუძნებელი ვერ მოიძებნა ან წვდომა შეზღუდულია');
    }
    return founder;
  }

  async create(dto: CreateFounderDto, companyId: string) {
    this.validateFounderData(dto, dto.type);

    return this.prisma.founder.create({
      data: {
        companyId,
        type: dto.type,
        firstName: dto.type === 'INDIVIDUAL' ? dto.firstName : null,
        lastName: dto.type === 'INDIVIDUAL' ? dto.lastName : null,
        phone: dto.type === 'INDIVIDUAL' ? dto.phone : null,
        email: dto.type === 'INDIVIDUAL' ? dto.email : null,
        personalId: dto.type === 'INDIVIDUAL' ? dto.personalId : null,
        companyName: dto.type === 'LEGAL_ENTITY' ? dto.companyName : null,
        companyCode: dto.type === 'LEGAL_ENTITY' ? dto.companyCode : null,
        representativeName: dto.type === 'LEGAL_ENTITY' ? dto.representativeName : null,
        representativePersonalId: dto.type === 'LEGAL_ENTITY' ? dto.representativePersonalId : null,
        isActiveMember: dto.isActiveMember ?? true,
        hasVotingRight: dto.hasVotingRight ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateFounderDto, companyId: string) {
    const existing = await this.findOne(id, companyId);
    
    // Merge existing fields to validate completely
    const merged = { ...existing, ...dto } as any;
    this.validateFounderData(merged, existing.type);

    return this.prisma.founder.update({
      where: { id },
      data: {
        firstName: existing.type === 'INDIVIDUAL' ? merged.firstName : null,
        lastName: existing.type === 'INDIVIDUAL' ? merged.lastName : null,
        phone: existing.type === 'INDIVIDUAL' ? merged.phone : null,
        email: existing.type === 'INDIVIDUAL' ? merged.email : null,
        personalId: existing.type === 'INDIVIDUAL' ? merged.personalId : null,
        companyName: existing.type === 'LEGAL_ENTITY' ? merged.companyName : null,
        companyCode: existing.type === 'LEGAL_ENTITY' ? merged.companyCode : null,
        representativeName: existing.type === 'LEGAL_ENTITY' ? merged.representativeName : null,
        representativePersonalId: existing.type === 'LEGAL_ENTITY' ? merged.representativePersonalId : null,
        isActiveMember: dto.isActiveMember !== undefined ? dto.isActiveMember : existing.isActiveMember,
        hasVotingRight: dto.hasVotingRight !== undefined ? dto.hasVotingRight : existing.hasVotingRight,
      },
    });
  }

  async remove(id: string, companyId: string) {
    await this.findOne(id, companyId);
    return this.prisma.founder.delete({
      where: { id },
    });
  }
}
