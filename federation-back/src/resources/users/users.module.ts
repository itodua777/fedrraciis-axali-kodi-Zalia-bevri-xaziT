import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { HashingModule } from 'src/authentication/hashing/hashing.module';
import { IamModule } from '../../iam/iam.module';

@Module({
    imports: [HashingModule, IamModule],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
    exports: [UsersService, UsersRepository],
})
export class UsersModule { }
