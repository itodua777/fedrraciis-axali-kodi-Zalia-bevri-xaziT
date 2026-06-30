import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException, UseFilters, ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UserAccessTokenGuard } from '../../authentication/guard/user.access.token.guard';
import { PoliciesGuard } from '../../iam/guards/policies.guard';
import { CheckPolicies } from '../../iam/decorators/check-policies.decorator';
import { Public } from '../../common/decorator/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Ensure upload directories exist at initialization
const uploadsDir = join(process.cwd(), 'uploads');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

const docsDir = join(process.cwd(), 'uploads', 'documents');
if (!existsSync(docsDir)) {
  mkdirSync(docsDir, { recursive: true });
}

@Catch()
export class UploadExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('UploadExceptionFilter');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception.message || exception.response?.message || 'Error uploading file';

    this.logger.error(
      `File upload failed for ${request.method} ${request.url}: ${message}`,
      exception.stack,
    );

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.response || null,
    });
  }
}

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
  @UseFilters(UploadExceptionFilter)
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

  @Post('profile/bank-accounts')
  @CheckPolicies((ability) => ability.can('update', 'Company'))
  async addBankAccount(@Request() req: any, @Body() body: CreateBankAccountDto) {
    const companyId = req.user.companyId;
    return this.companiesService.addBankAccount(companyId, body.bankName, body.iban);
  }

  @Delete('profile/bank-accounts/:id')
  @CheckPolicies((ability) => ability.can('update', 'Company'))
  async deleteBankAccount(@Request() req: any, @Param('id') id: string) {
    const companyId = req.user.companyId;
    return this.companiesService.deleteBankAccount(companyId, id);
  }

  @Post('profile/documents')
  @CheckPolicies((ability) => ability.can('update', 'Company'))
  @UseFilters(UploadExceptionFilter)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads', 'documents');
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `doc-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadDocument(
    @Request() req: any,
    @Body() body: CreateDocumentDto,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('Uploaded file is missing or invalid.');
    }
    const companyId = req.user.companyId;
    const fileUrl = `/uploads/documents/${file.filename}`;
    const format = extname(file.originalname).substring(1).toUpperCase();
    return this.companiesService.addDocument(companyId, body.title, file.originalname, fileUrl, format);
  }

  @Delete('profile/documents/:id')
  @CheckPolicies((ability) => ability.can('update', 'Company'))
  async deleteDocument(@Request() req: any, @Param('id') id: string) {
    const companyId = req.user.companyId;
    return this.companiesService.deleteDocument(companyId, id);
  }
}
