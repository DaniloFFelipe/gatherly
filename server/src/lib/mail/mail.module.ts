import { Global, Module } from '@nestjs/common';
import { BullMQModule } from '../bullmq/bull.module';
import { MailConsumer } from './mail.consumer';
import { MailService, QueueMailService } from './mail.service';

@Global()
@Module({
  imports: [BullMQModule.registerQueue('mail')],
  providers: [
    MailConsumer,
    {
      provide: MailService,
      useClass: QueueMailService,
    },
  ],
  exports: [MailService],
})
export class MailModule {}
