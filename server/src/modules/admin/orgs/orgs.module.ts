import { Module } from '@nestjs/common';
import { OrgsService } from './core/orgs.service';
import { OrgsController } from './http/orgs.controller';

@Module({
  providers: [OrgsService],
  controllers: [OrgsController],
})
export class OrgsModule {}
