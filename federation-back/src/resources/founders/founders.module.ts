import { Module } from '@nestjs/common';
import { FoundersService } from './founders.service';
import { FoundersController } from './founders.controller';
import { IamModule } from '../../iam/iam.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [IamModule, PrismaModule],
  controllers: [FoundersController],
  providers: [FoundersService],
  exports: [FoundersService],
})
export class FoundersModule {}
