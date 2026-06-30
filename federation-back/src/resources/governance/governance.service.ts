import { Injectable, NotFoundException } from '@nestjs/common';
import { GovernanceRepository } from './governance.repository';
import { CreateGovernanceUnitDto } from './dto/create-governance-unit.dto';
import { UpdateGovernanceUnitDto } from './dto/update-governance-unit.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class GovernanceService {
  constructor(
    private readonly governanceRepository: GovernanceRepository,
    private readonly prisma: PrismaService,
    private readonly cls: ClsService,
  ) {}

  private async resolveCompanyId(companyId?: string): Promise<string> {
    if (companyId && companyId.trim() !== '') {
      return companyId;
    }
    try {
      const user = this.cls.get('user');
      if (user?.companyId) {
        return user.companyId;
      }
    } catch (e) {
      // ignore
    }
    throw new Error('No company ID resolved from context.');
  }

  async seedPresets(companyId: string) {
    const resolvedCompanyId = await this.resolveCompanyId(companyId);
    // 1. Assembly (Root)
    const assembly = await this.prisma.governanceUnit.create({
      data: { name: 'ფედერაციის ყრილობა (Assembly)', companyId: resolvedCompanyId },
    });

    // 2. Board (Child of Assembly)
    const board = await this.prisma.governanceUnit.create({
      data: { name: 'ფედერაციის გამგეობა (Board)', parentId: assembly.id, companyId: resolvedCompanyId },
    });

    // 3. Audit Commission (Child of Assembly)
    await this.prisma.governanceUnit.create({
      data: { name: 'ფედერაციის სარევიზიო კომისია (Audit Commission)', parentId: assembly.id, companyId: resolvedCompanyId },
    });

    // 4. President (Child of Board)
    const president = await this.prisma.governanceUnit.create({
      data: { name: 'ფედერაციის პრეზიდენტი (President)', parentId: board.id, companyId: resolvedCompanyId },
    });

    // 5. Sectoral Committees (Child of Board)
    await this.prisma.governanceUnit.create({
      data: { name: 'ფედერაციის დარგობრივი კომისიები (Sectoral Committees)', parentId: board.id, companyId: resolvedCompanyId },
    });

    // 6. Vice-President (Child of President)
    await this.prisma.governanceUnit.create({
      data: { name: 'ფედერაციის ვიცე-პრეზიდენტი (Vice-President)', parentId: president.id, companyId: resolvedCompanyId },
    });

    // 7. CEO / General Secretary (Child of President)
    const ceo = await this.prisma.governanceUnit.create({
      data: {
        name: 'ფედერაციის აღმასრულებელი დირექტორი / გენერალური მდივანი (CEO/General Secretary)',
        parentId: president.id,
        companyId: resolvedCompanyId,
      },
    });

    // 8. CFO / Treasurer (Child of CEO/General Secretary)
    await this.prisma.governanceUnit.create({
      data: {
        name: 'ფედერაციის ფინანსური დირექტორი / ხაზინადარი (CFO/Treasurer)',
        parentId: ceo.id,
        companyId: resolvedCompanyId,
      },
    });
  }

  async findTree(companyId: string) {
    const resolvedCompanyId = await this.resolveCompanyId(companyId);
    let units = await this.governanceRepository.findAllByCompany(resolvedCompanyId);
    if (units.length === 0) {
      await this.seedPresets(resolvedCompanyId);
      units = await this.governanceRepository.findAllByCompany(resolvedCompanyId);
    }

    const map = new Map<string, any>();
    units.forEach((u) => {
      map.set(u.id, { ...u, children: [] });
    });

    const roots: any[] = [];
    units.forEach((u) => {
      const mapped = map.get(u.id);
      if (u.parentId && map.has(u.parentId)) {
        map.get(u.parentId).children.push(mapped);
      } else {
        roots.push(mapped);
      }
    });

    return roots;
  }

  async findOne(id: string, companyId: string) {
    const resolvedCompanyId = await this.resolveCompanyId(companyId);
    const unit = await this.governanceRepository.findById(id);
    if (!unit || unit.companyId !== resolvedCompanyId) {
      throw new NotFoundException(`Governance unit with ID ${id} not found`);
    }
    return unit;
  }

  async create(dto: CreateGovernanceUnitDto, companyId: string) {
    const resolvedCompanyId = await this.resolveCompanyId(companyId);
    return this.governanceRepository.create(dto, resolvedCompanyId);
  }

  async update(id: string, dto: UpdateGovernanceUnitDto, companyId: string) {
    const resolvedCompanyId = await this.resolveCompanyId(companyId);
    await this.findOne(id, resolvedCompanyId);
    return this.governanceRepository.update(id, dto);
  }

  async delete(id: string, companyId: string) {
    const resolvedCompanyId = await this.resolveCompanyId(companyId);
    await this.findOne(id, resolvedCompanyId);
    return this.governanceRepository.delete(id);
  }

  async moveUnit(id: string, parentId: string | null, companyId: string) {
    const resolvedCompanyId = await this.resolveCompanyId(companyId);
    await this.findOne(id, resolvedCompanyId);
    if (parentId) {
      await this.findOne(parentId, resolvedCompanyId);
    }
    return this.governanceRepository.updateParent(id, parentId);
  }
}
