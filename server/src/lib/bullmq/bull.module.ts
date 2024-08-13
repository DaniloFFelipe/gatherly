import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
})
export class BullMQModule {
  static registerQueue(name: string): DynamicModule {
    return BullModule.registerQueue({
      name,
    });
  }
}
