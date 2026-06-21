import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { BranchesRepository } from './branches.repository';
import { IamModule } from '../../iam/iam.module';

@Module({
    imports: [IamModule],
    controllers: [BranchesController],
    providers: [BranchesService, BranchesRepository],
    exports: [BranchesRepository],
})
export class BranchesModule { }
