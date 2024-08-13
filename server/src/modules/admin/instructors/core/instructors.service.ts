import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/database/prisma.service';
import { PermissionService } from 'src/modules/common/roles/permissions.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { getUserPermissions } from 'src/modules/common/roles/utils';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import {
  createPaginationResponse,
  Pagination,
} from 'src/modules/common/types/pagination';

@Injectable()
export class InstructorsService {
  constructor(
    private prisma: PrismaService,
    private permissions: PermissionService,
  ) {}

  async createInstructor(
    slug: string,
    userId: string,
    data: CreateInstructorDto,
  ) {
    const { membership } = await this.permissions.getUserMembership(
      slug,
      userId,
    );

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('create', 'Event')) {
      throw new ForbiddenException(
        `You're not allowed to create new instructor.`,
      );
    }

    const instructor = await this.prisma.instructor.create({
      data: {
        ...data,
        organizationId: membership.organizationId,
      },
    });

    return {
      instructorId: instructor.id,
    };
  }

  async updateInstructor(
    instructorId: string,
    slug: string,
    userId: string,
    data: UpdateInstructorDto,
  ) {
    const { membership } = await this.permissions.getUserMembership(
      slug,
      userId,
    );

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('update', 'Event')) {
      throw new ForbiddenException(`You're not allowed to update instructor.`);
    }
    const instructor = await this.findById(
      instructorId,
      membership.organizationId,
    );
    await this.prisma.instructor.update({
      where: {
        id: instructor.id,
      },
      data,
    });
  }

  async deleteInstructor(slug: string, userId: string, instructorId: string) {
    const { membership } = await this.permissions.getUserMembership(
      slug,
      userId,
    );

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('delete', 'Event')) {
      throw new ForbiddenException(`You're not allowed to delete instructor.`);
    }
    const instructor = await this.findById(
      instructorId,
      membership.organizationId,
    );
    await this.prisma.instructor.delete({
      where: {
        id: instructor.id,
      },
    });
  }

  async getInstructors(slug: string, userId: string, pagination: Pagination) {
    const { membership } = await this.permissions.getUserMembership(
      slug,
      userId,
    );

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('get', 'Event')) {
      throw new ForbiddenException(`You're not allowed to get instructors.`);
    }
    const [data, total] = await Promise.all([
      this.prisma.instructor.findMany({
        where: {
          organizationId: membership.organizationId,
        },
        take: pagination.perPage,
        skip: pagination.pageIndex * pagination.perPage,
      }),
      this.prisma.instructor.count({
        where: {
          organizationId: membership.organizationId,
        },
      }),
    ]);

    return createPaginationResponse(data, total, pagination);
  }

  async findById(id: string, organizationId: string) {
    const instructor = await this.prisma.instructor.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    if (!instructor) {
      throw new BadRequestException('Instructor not found');
    }

    return instructor;
  }
}
