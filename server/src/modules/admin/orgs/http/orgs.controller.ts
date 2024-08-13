import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, ICurrentUser } from 'src/lib/auth/current-user.decorator';
import { OrgsService } from '../core/orgs.service';
import { CreateOrgDto } from '../core/dto/create-org.dto';
import { UpdateOrgDto } from '../core/dto/update-org.dto';

@Controller('admin')
@ApiTags('admin')
@UsePipes(ZodValidationPipe)
export class OrgsController {
  constructor(private service: OrgsService) {}

  @Post('/orgs')
  @ApiCreatedResponse({
    type: CreateOrgDto,
  })
  createOrg(@Body() data: CreateOrgDto, @CurrentUser() { sub }: ICurrentUser) {
    return this.service.createOrganization(sub, data);
  }

  @Post('/orgs/:slug')
  @ApiCreatedResponse({
    type: UpdateOrgDto,
  })
  updateOrg(
    @Body() data: UpdateOrgDto,
    @Param('slug') slug: string,
    @CurrentUser() { sub }: ICurrentUser,
  ) {
    return this.service.updateOrganization(slug, sub, data);
  }

  @Get('/orgs/:slug')
  getOrg(@Param('slug') slug: string, @CurrentUser() { sub }: ICurrentUser) {
    return this.service.getOrganization(slug, sub);
  }

  @Get('/orgs')
  getOrgs(@CurrentUser() { sub }: ICurrentUser) {
    return this.service.getOrganizations(sub);
  }
}
