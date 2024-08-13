import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/database/prisma.service';
import { PermissionService } from 'src/modules/common/roles/permissions.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { getUserPermissions } from 'src/modules/common/roles/utils';
import { createSlug } from 'src/modules/common/utils/create-slug';
import { UpdateEventDto } from './dtos/update-event.dto';
import {
  createPaginationResponse,
  Pagination,
} from 'src/modules/common/types/pagination';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private permissions: PermissionService,
  ) {}

  async createEvent(
    slug: string,
    userId: string,
    { avatarUrl, description, name }: CreateEventDto,
  ) {
    const { organization, membership } =
      await this.permissions.getUserMembership(slug, userId);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('create', 'Event')) {
      throw new ForbiddenException(`You're not allowed to create new events.`);
    }

    const event = await this.prisma.event.create({
      data: {
        slug: createSlug(name),
        avatarUrl,
        description,
        name,
        organizationId: organization.id,
      },
    });

    return {
      slug: event.slug,
    };
  }

  async deleteEvent(eventSlug: string, slug: string, userId: string) {
    const { membership } = await this.permissions.getUserMembership(
      slug,
      userId,
    );

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('delete', 'Event')) {
      throw new ForbiddenException(`You're not allowed to delete events.`);
    }

    const { event } = await this.findBySlug(eventSlug);
    if (event.organizationId !== membership.organizationId) {
      throw new ForbiddenException(`You're not allowed to delete events.`);
    }

    await this.prisma.event.delete({
      where: {
        id: event.id,
      },
    });
  }

  async updateEvent(
    eventSlug: string,
    slug: string,
    userId: string,
    data: UpdateEventDto,
  ) {
    const { membership } = await this.permissions.getUserMembership(
      slug,
      userId,
    );

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('delete', 'Event')) {
      throw new ForbiddenException(`You're not allowed to update events.`);
    }

    const { event } = await this.findBySlug(eventSlug);
    if (event.organizationId !== membership.organizationId) {
      throw new ForbiddenException(`You're not allowed to delete events.`);
    }

    await this.prisma.event.update({
      where: {
        id: event.id,
      },
      data,
    });
  }

  async getEvent(eventSlug: string, slug: string, userId: string) {
    const { membership } = await this.permissions.getUserMembership(
      slug,
      userId,
    );

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('get', 'Event')) {
      throw new ForbiddenException(`You're not allowed to update events.`);
    }

    const { event } = await this.findBySlug(eventSlug);
    if (event.organizationId !== membership.organizationId) {
      throw new ForbiddenException(`You're not allowed to delete events.`);
    }

    return {
      event,
    };
  }

  async getEvents(
    slug: string,
    userId: string,
    { pageIndex, perPage }: Pagination,
  ) {
    const { membership } = await this.permissions.getUserMembership(
      slug,
      userId,
    );

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('get', 'Event')) {
      throw new ForbiddenException(`You're not allowed to update events.`);
    }

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where: {
          organizationId: membership.organizationId,
        },
        take: perPage,
        skip: pageIndex * perPage,
      }),
      this.prisma.event.count({
        where: {
          organizationId: membership.organizationId,
        },
      }),
    ]);

    return createPaginationResponse(events, total, { perPage, pageIndex });
  }

  async findBySlug(eventSlug: string) {
    const event = await this.prisma.event.findUnique({
      where: {
        slug: eventSlug,
      },
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        avatarUrl: true,
        organizationId: true,
        organization: {
          select: {
            avatarUrl: true,
            name: true,
            id: true,
          },
        },
      },
    });

    if (!event) {
      throw new BadRequestException('Event not found');
    }

    return { event };
  }
}
