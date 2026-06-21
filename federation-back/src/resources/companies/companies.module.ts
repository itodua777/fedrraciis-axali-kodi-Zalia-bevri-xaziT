import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { CompaniesRepository } from './companies.repository';
import { IamModule } from '../../iam/iam.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [IamModule, UsersModule],
    controllers: [CompaniesController],
    providers: [CompaniesService, CompaniesRepository],
    exports: [CompaniesRepository],
})
export class CompaniesModule { }
