import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateCompanyDto } from './dto/create-company.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { CompaniesRepository } from './companies.repository';
import { UsersRepository } from '../users/users.repository';

import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly companiesRepository: CompaniesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    return this.companiesRepository.create(createCompanyDto);
  }

  async register(dto: RegisterCompanyDto) {
    // Prevent registering if the administrator's email is already registered
    const existingUser = await this.usersRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('A user with this email is already registered.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const result = await this.companiesRepository.register(dto, hashedPassword);

    return {
      ...result,
      user: { ...result.user, password: undefined },
    };
  }

  async getProfile(companyId: string) {
    const company = await this.companiesRepository.findById(companyId);
    if (!company) return null;
    const isProfileComplete = !!(
      company.bankName &&
      company.bankName.trim() !== '' &&
      company.iban &&
      company.iban.trim() !== '' &&
      company.publicEmail &&
      company.publicEmail.trim() !== ''
    );
    return {
      ...company,
      isProfileComplete,
    };
  }

  async updateProfile(companyId: string, dto: UpdateCompanyProfileDto) {
    const company = await this.companiesRepository.update(companyId, dto);
    if (!company) return null;
    const isProfileComplete = !!(
      company.bankName &&
      company.bankName.trim() !== '' &&
      company.iban &&
      company.iban.trim() !== '' &&
      company.publicEmail &&
      company.publicEmail.trim() !== ''
    );
    return {
      ...company,
      isProfileComplete,
    };
  }

  async updateLogo(companyId: string, logoUrl: string) {
    return this.companiesRepository.update(companyId, { logoUrl });
  }

  async findAll() {
    return this.companiesRepository.findAll();
  }
}
