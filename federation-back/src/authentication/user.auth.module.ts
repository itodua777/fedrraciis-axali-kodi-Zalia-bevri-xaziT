import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserAuthService } from './user.auth.service';
import { UserAccessStrategy } from './strategy/user.access.strategy';
import { RefreshTokenStrategy } from './strategy/refresh.token.strategy';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/resources/users/users.module';
import { UserLocalLoginStrategy } from './strategy/user.local.login.strategy';
import { UserAuthController } from './user.auth.controller';
import { HashingModule } from './hashing/hashing.module';

@Module({
  imports: [
    HashingModule,
    UsersModule,
    ConfigModule,
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [
    UserAuthService,
    UserLocalLoginStrategy,
    UserAccessStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [UserAuthController],
  exports: [UserAuthService],
})
export class UserAuthModule { }
