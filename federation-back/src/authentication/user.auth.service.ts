import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { UsersRepository } from 'src/resources/users/users.repository';
import { HashingService } from './hashing/hashing.service';
import { AuthTokens } from './interface/auth.tokens';
import { JwtPayload } from './interface/jwt.payload';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UsersRepository,
    private readonly hashingService: HashingService,
    private readonly configService: ConfigService,
  ) { }

  //! Email/Password Validation
  async validateUserLogin(email: string, password: string): Promise<AuthTokens> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    if (user.isDeleted) throw new UnauthorizedException('User is deleted');
    if (!user.isActive) throw new ForbiddenException('User is paused');

    const isPasswordValid = await this.hashingService.compare(
      password,
      user.password,
    );

    if (isPasswordValid) {
      return this.login(user);
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  //! Login -> Generate and Save Refresh Token
  async login(user: any): Promise<AuthTokens> {
    const payload: JwtPayload = {
      companyId: user.companyId,
      companyName: user.company?.name,
      roleId: user.roleId || '',
      userId: user.id,
      branchId: user.branchId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isSuperUser: user.isSuperUser,
      position: user.position,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('KEY'),
      expiresIn: '1d',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '30d',
    });

    // Hash refresh token (standard bcrypt)
    const hashedRefreshToken = await this.hashingService.hash(refreshToken);

    await this.userRepository.updateRefreshToken(
      user.id,
      hashedRefreshToken,
    );

    return { 
      accessToken, 
      refreshToken,
      companyName: user.company?.name,
    };
  }

  //! Refresh -> Verify Stored Hashed Token
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const isRefreshTokenValid = await this.hashingService.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenValid)
      throw new UnauthorizedException('Invalid refresh token');

    return this.login(user); // Generates new tokens
  }

  //! Logout -> Clear Refresh Token
  async logout(userId: string) {
    await this.userRepository.updateRefreshToken(userId, null);
  }
}
