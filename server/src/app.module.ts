import { Module } from '@nestjs/common';
import { AuthModule } from './lib/auth/auth.module';
import { DatabaseModule } from './lib/database/database.module';
import { AdminModule } from './modules/admin/admin.module';
import { BullMQModule } from './lib/bullmq/bull.module';
import { MailModule } from './lib/mail/mail.module';

@Module({
  imports: [BullMQModule, MailModule, AuthModule, DatabaseModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
