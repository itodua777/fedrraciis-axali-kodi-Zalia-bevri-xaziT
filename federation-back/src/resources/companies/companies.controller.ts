import { Controller, Get, Post, Put, Body, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { UserAccessTokenGuard } from '../../authentication/guard/user.access.token.guard';
import { PoliciesGuard } from '../../iam/guards/policies.guard';
import { CheckPolicies } from '../../iam/decorators/check-policies.decorator';
import { Public } from '../../common/decorator/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@UseGuards(UserAccessTokenGuard, PoliciesGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Public()
  @Post('register')
  register(@Body() registerCompanyDto: RegisterCompanyDto) {
    return this.companiesService.register(registerCompanyDto);
  }

  @Post()
  @CheckPolicies((ability) => ability.can('create', 'Company'))
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get('profile')
  @CheckPolicies((ability) => ability.can('read', 'Company'))
  getProfile(@Request() req: any) {
    const companyId = req.user.companyId;
    return this.companiesService.getProfile(companyId);
  }

  @Put('profile')
  @CheckPolicies((ability) => ability.can('update', 'Company'))
  updateProfile(@Request() req: any, @Body() updateDto: UpdateCompanyProfileDto) {
    const companyId = req.user.companyId;
    return this.companiesService.updateProfile(companyId, updateDto);
  }

  @Post('profile/logo')
  @CheckPolicies((ability) => ability.can('update', 'Company'))
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads');
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `logo-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadLogo(@Request() req: any, @UploadedFile() file: any) {
    const companyId = req.user.companyId;
    const logoUrl = `/uploads/${file.filename}`;
    await this.companiesService.updateLogo(companyId, logoUrl);
    return { logoUrl };
  }

  @Get()
  @CheckPolicies((ability) => ability.can('read', 'Company'))
  findAll() {
    return this.companiesService.findAll();
  }
}
