import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
    async hash(data: string, saltOrRounds: string | number = 10): Promise<string> {
        return bcrypt.hash(data, saltOrRounds);
    }

    async compare(data: string, encrypted: string): Promise<boolean> {
        return bcrypt.compare(data, encrypted);
    }
}
