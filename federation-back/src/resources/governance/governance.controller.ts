import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { GovernanceService } from './governance.service';
import { CreateGovernanceUnitDto } from './dto/create-governance-unit.dto';
import { UpdateGovernanceUnitDto } from './dto/update-governance-unit.dto';
import { UserAccessTokenGuard } from '../../authentication/guard/user.access.token.guard';
import { ActiveUser } from '../../iam/decorators/active-user.decorator';
import { Public } from '../../common/decorator/public.decorator';

@Public()
@UseGuards(UserAccessTokenGuard)
@Controller('api/governance')
export class GovernanceController {
  constructor(private readonly governanceService: GovernanceService) {}

  @Get()
  async getTree(
    @ActiveUser('companyId') activeCompanyId: string,
    @Req() req: Request,
  ) {
    const companyId = this.resolveCompanyId(activeCompanyId, req);
    return this.governanceService.findTree(companyId);
  }

  @Post()
  async create(
    @Body() dto: CreateGovernanceUnitDto,
    @ActiveUser('companyId') activeCompanyId: string,
    @Req() req: Request,
  ) {
    const companyId = this.resolveCompanyId(activeCompanyId, req);
    return this.governanceService.create(dto, companyId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGovernanceUnitDto,
    @ActiveUser('companyId') activeCompanyId: string,
    @Req() req: Request,
  ) {
    const companyId = this.resolveCompanyId(activeCompanyId, req);
    return this.governanceService.update(id, dto, companyId);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @ActiveUser('companyId') activeCompanyId: string,
    @Req() req: Request,
  ) {
    const companyId = this.resolveCompanyId(activeCompanyId, req);
    return this.governanceService.delete(id, companyId);
  }

  @Post('move')
  async move(
    @Body() body: { draggedId: string; targetId: string | null },
    @ActiveUser('companyId') activeCompanyId: string,
    @Req() req: Request,
  ) {
    const companyId = this.resolveCompanyId(activeCompanyId, req);
    return this.governanceService.moveUnit(body.draggedId, body.targetId, companyId);
  }

  private resolveCompanyId(activeCompanyId: string, req: Request): string {
    const companyId =
      (req.user as any)?.companyId ||
      activeCompanyId ||
      (req.query?.companyId as string) ||
      (req.headers?.['x-company-id'] as string) ||
      (req.headers?.['company-id'] as string) ||
      this.extractCompanyIdFromHeaders(req);

    if (!companyId) {
      throw new Error('Unauthorized: companyId not found in request metadata, headers or token.');
    }
    return companyId;
  }

  private extractCompanyIdFromHeaders(req: Request): string | undefined {
    const authHeader = req.headers?.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length >= 2) {
            const payloadBase64 = tokenParts[1];
            const decodedPayload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
            return decodedPayload?.companyId;
          }
        } catch (e) {
          // ignore
        }
      }
    }
    return undefined;
  }
}
