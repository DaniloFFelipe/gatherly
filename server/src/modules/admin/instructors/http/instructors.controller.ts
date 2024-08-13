import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, ICurrentUser } from 'src/lib/auth/current-user.decorator';
import { InstructorsService } from '../core/instructors.service';
import { CreateInstructorDto } from '../core/dto/create-instructor.dto';
import { UpdateInstructorDto } from '../core/dto/update-instructor.dto';
import { Pagination } from 'src/modules/common/types/pagination';

@Controller('admin/orgs/:slug')
@ApiTags('admin')
@UsePipes(ZodValidationPipe)
export class InstructorsController {
  constructor(private service: InstructorsService) {}

  @Post('/instructors')
  @ApiCreatedResponse({
    type: CreateInstructorDto,
  })
  createInstructor(
    @Body() data: CreateInstructorDto,
    @CurrentUser() { sub }: ICurrentUser,
    @Param('slug') slug: string,
  ) {
    return this.service.createInstructor(slug, sub, data);
  }

  @Post('/instructors/:instructorId')
  @ApiCreatedResponse({
    type: UpdateInstructorDto,
  })
  updateInstructor(
    @Body() data: UpdateInstructorDto,
    @Param('slug') slug: string,
    @Param('instructorId') instructorId: string,
    @CurrentUser() { sub }: ICurrentUser,
  ) {
    return this.service.updateInstructor(instructorId, slug, sub, data);
  }

  @Get('/instructors')
  getInstructors(
    @Param('slug') slug: string,
    @CurrentUser() { sub }: ICurrentUser,
    @Query() pagination: Pagination,
  ) {
    return this.service.getInstructors(slug, sub, pagination);
  }
}
