import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RolesRepository } from './roles.repository';
import { IamModule } from '../../iam/iam.module';

@Module({
    imports: [IamModule],
    controllers: [RolesController],
    providers: [RolesService, RolesRepository],
    exports: [RolesRepository],
})
export class RolesModule { }
