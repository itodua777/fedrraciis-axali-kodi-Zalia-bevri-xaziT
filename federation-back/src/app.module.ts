import { Module } from '@nestjs/common';
import { clsOptions } from './lib/cls.options';
import { ClsModule } from 'nestjs-cls';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { IamModule } from './iam/iam.module';
import { RolesModule } from './resources/roles/roles.module';
import { CompaniesModule } from './resources/companies/companies.module';
import { BranchesModule } from './resources/branches/branches.module';
import { DepartmentsModule } from './resources/departments/departments.module';
import { UsersModule } from './resources/users/users.module';
import { UserAuthModule } from './authentication/user.auth.module';
import { StructureModule } from './resources/structure/structure.module';
import { GovernanceModule } from './resources/governance/governance.module';
import { FoundersModule } from './resources/founders/founders.module';
import { APP_GUARD } from '@nestjs/core';
import { ProfileCompletionGuard } from './authentication/guard/profile.completion.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClsModule.forRoot(clsOptions),
    PrismaModule,
    IamModule,
    RolesModule,
    CompaniesModule,
    BranchesModule,
    DepartmentsModule,
    UsersModule,
    UserAuthModule,
    StructureModule,
    GovernanceModule,
    FoundersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ProfileCompletionGuard,
    },
  ],
})
export class AppModule {}
