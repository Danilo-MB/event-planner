import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { StorageModule } from '../storage/storage.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [StorageModule, AuthModule],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService]
})
export class BillingModule {}
