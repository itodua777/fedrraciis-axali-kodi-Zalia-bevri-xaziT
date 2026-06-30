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
      company.name &&
      company.name.trim() !== '' &&
      company.identificationCode &&
      company.identificationCode.trim() !== '' &&
      company.sportsDomain &&
      company.sportsDomain.trim() !== '' &&
      company.legalForm &&
      company.legalForm.trim() !== '' &&
      company.branches &&
      company.branches.length > 0 &&
      company.branches[0].legalAddress &&
      company.branches[0].legalAddress.trim() !== ''
    );
    
    // Extract first user (owner) details
    const owner = company.users?.find((u: any) => u.role?.name === 'company_admin') || company.users?.[0] || null;
    const ownerInfo = owner ? {
      firstName: owner.firstName,
      lastName: owner.lastName,
      email: owner.email,
      createdAt: owner.createdAt,
    } : null;

    return {
      ...company,
      bankAccounts: company.bankAccounts || [],
      documents: company.documents || [],
      isProfileComplete,
      owner: ownerInfo,
    };
  }

  async updateProfile(companyId: string, dto: UpdateCompanyProfileDto) {
    const company = await this.companiesRepository.update(companyId, dto);
    if (!company) return null;
    return this.getProfile(companyId);
  }

  async addBankAccount(companyId: string, bankName: string, iban: string) {
    await this.companiesRepository.addBankAccount(companyId, bankName, iban);
    return this.getProfile(companyId);
  }

  async deleteBankAccount(companyId: string, id: string) {
    await this.companiesRepository.deleteBankAccount(companyId, id);
    return this.getProfile(companyId);
  }

  async addDocument(companyId: string, title: string, fileName: string, fileUrl: string, format: string) {
    await this.companiesRepository.addDocument(companyId, title, fileName, fileUrl, format);
    return this.getProfile(companyId);
  }

  async deleteDocument(companyId: string, id: string) {
    const company = await this.companiesRepository.findById(companyId);
    if (company && company.documents) {
      const doc = company.documents.find(d => d.id === id);
      if (doc) {
        const { existsSync, unlinkSync } = require('fs');
        const { join } = require('path');
        const filePath = join(process.cwd(), doc.fileUrl.startsWith('/') ? doc.fileUrl.substring(1) : doc.fileUrl);
        try {
          if (existsSync(filePath)) {
            unlinkSync(filePath);
          }
        } catch (err) {
          console.error('Error deleting file from disk:', err);
        }
      }
    }
    await this.companiesRepository.deleteDocument(companyId, id);
    return this.getProfile(companyId);
  }

  async updateLogo(companyId: string, logoUrl: string) {
    return this.companiesRepository.update(companyId, { logoUrl });
  }

  async findAll() {
    return this.companiesRepository.findAll();
  }
}
