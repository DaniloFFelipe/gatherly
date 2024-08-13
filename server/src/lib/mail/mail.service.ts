import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { SendMailDto } from './mail.dtos';

export abstract class MailService {
  abstract sendMail(data: SendMailDto): Promise<void>;
}

@Injectable()
export class QueueMailService implements MailService {
  constructor(@InjectQueue('mail') private mailQueue: Queue<SendMailDto>) {}

  async sendMail(data: SendMailDto) {
    await this.mailQueue.add('send', data);
  }
}
