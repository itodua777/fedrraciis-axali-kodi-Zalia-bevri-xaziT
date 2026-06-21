import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { DepartmentsRepository } from './departments.repository';
import { IamModule } from '../../iam/iam.module';

@Module({
    imports: [IamModule],
    controllers: [DepartmentsController],
    providers: [DepartmentsService, DepartmentsRepository],
    exports: [DepartmentsRepository],
})
export class DepartmentsModule { }
