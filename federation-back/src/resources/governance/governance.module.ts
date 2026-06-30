import { Module } from '@nestjs/common';
import { GovernanceService } from './governance.service';
import { GovernanceController } from './governance.controller';
import { GovernanceRepository } from './governance.repository';
import { IamModule } from '../../iam/iam.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [IamModule, PrismaModule],
  controllers: [GovernanceController],
  providers: [GovernanceService, GovernanceRepository],
  exports: [GovernanceService, GovernanceRepository],
})
export class GovernanceModule {}
