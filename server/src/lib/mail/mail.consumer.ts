import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SendMailDto } from './mail.dtos';
import { mail } from './nodemailler';

@Processor('mail')
export class MailConsumer extends WorkerHost {
  async process(job: Job<any, any, 'send'>): Promise<void> {
    switch (job.name) {
      case 'send': {
        const data = job.data as SendMailDto;
        await mail.sendMail({
          to: data.to,
          subject: data.subject,
          text: data.content,
        });
      }
    }
  }
}
