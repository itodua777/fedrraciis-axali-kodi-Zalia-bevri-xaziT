import { Injectable, OnModuleInit, OnModuleDestroy, ForbiddenException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    private readonly rawClient: PrismaClient;

    constructor(private readonly cls: ClsService) {
        super();
        this.rawClient = new PrismaClient();
    }

    async onModuleInit() {
        await this.$connect();
        await this.rawClient.$connect();

        this.$use(async (params, next) => {
            const user = this.cls.get('user');

            if (!user || !user.companyId) {
                return next(params);
            }

            const tenantModels = ['User', 'Department', 'Branch', 'Role', 'Permission'];

            if (params.model && tenantModels.includes(params.model)) {
                const modelKey = params.model.charAt(0).toLowerCase() + params.model.slice(1);

                // 1. Convert findUnique to findFirst to allow companyId filtering
                if (params.action === 'findUnique') {
                    params.action = 'findFirst';
                }

                // 2. Enforce companyId filter on reads and bulk writes
                if (
                    params.action === 'findFirst' ||
                    params.action === 'findMany' ||
                    params.action === 'count' ||
                    params.action === 'aggregate' ||
                    params.action === 'groupBy' ||
                    params.action === 'updateMany' ||
                    params.action === 'deleteMany'
                ) {
                    if (!params.args) params.args = {};
                    if (!params.args.where) params.args.where = {};
                    params.args.where.companyId = user.companyId;
                }

                // 3. Enforce companyId on creations
                if (params.action === 'create') {
                    if (!params.args) params.args = {};
                    if (!params.args.data) params.args.data = {};
                    params.args.data.companyId = user.companyId;
                }

                if (params.action === 'createMany') {
                    if (!params.args) params.args = {};
                    if (!params.args.data) params.args.data = [];
                    if (Array.isArray(params.args.data)) {
                        params.args.data.forEach((item: any) => {
                            item.companyId = user.companyId;
                        });
                    } else if (params.args.data) {
                        params.args.data.companyId = user.companyId;
                    }
                }

                // 4. Secure single-record updates and deletes
                if (params.action === 'update' || params.action === 'delete') {
                    const where = params.args?.where;
                    if (where) {
                        const record = await this.rawClient[modelKey].findFirst({
                            where: { ...where, companyId: user.companyId },
                            select: { id: true },
                        });
                        if (!record) {
                            throw new ForbiddenException(`Access to this ${params.model} is denied.`);
                        }
                    }
                }
            }

            return next(params);
        });
    }

    async onModuleDestroy() {
        await this.$disconnect();
        await this.rawClient.$disconnect();
    }
}
