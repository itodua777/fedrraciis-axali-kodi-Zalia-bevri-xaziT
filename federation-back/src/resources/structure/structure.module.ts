import { Module } from '@nestjs/common';
import { StructureService } from './structure.service';
import { StructureController } from './structure.controller';
import { StructureRepository } from './structure.repository';
import { IamModule } from '../../iam/iam.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { HashingModule } from '../../authentication/hashing/hashing.module';

@Module({
    imports: [IamModule, PrismaModule, HashingModule],
    controllers: [StructureController],
    providers: [StructureService, StructureRepository],
    exports: [StructureService, StructureRepository],
})
export class StructureModule { }
