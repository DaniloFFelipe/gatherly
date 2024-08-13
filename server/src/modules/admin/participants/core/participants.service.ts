import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/database/prisma.service';
import { PermissionService } from 'src/modules/common/roles/permissions.service';
import { CreateParticipantDto } from './dto/create-participants.dto';
import { getUserPermissions } from 'src/modules/common/roles/utils';
import { EventsService } from '../../events/core/events.service';
import { UpdateParticipantDto } from './dto/update-participants.dto';
import { Prisma } from '@prisma/client';
import { codeGen } from 'src/modules/common/utils/code-gen';
import { MailService } from 'src/lib/mail/mail.service';

@Injectable()
export class ParticipantsService {
  constructor(
    private prisma: PrismaService,
    private permissions: PermissionService,
    private eventService: EventsService,
    private mailService: MailService,
  ) {}

  async createParticipant(
    slug: string,
    eventSlug: string,
    userId: string,
    { email, name }: CreateParticipantDto,
  ) {
    const { membership } = await this.permissions.getUserMembership(
      slug,
      userId,
    );

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('get', 'Participant')) {
      throw new ForbiddenException(
        `You're not allowed to create new participant.`,
      );
    }

    const { event } = await this.eventService.findBySlug(eventSlug);
    if (event.organizationId !== membership.organizationId) {
      throw new ForbiddenException(
        `You're not allowed to get new participant.`,
      );
    }
    const participantExists = await this.findByEmailAndEventId(email, event.id);
    if (participantExists) {
      throw new BadRequestException('Participant is already on event');
    }

    const participant = await this.prisma.participant.create({
      data: {
        code: codeGen(),
        email,
        name,
        eventId: event.id,
      },
    });

    await this.mailService.sendMail({
      content: `Your was invited to ${event.name}. Use this code ${participant.code} to access the event`,
      subject: 'Invitation',
      to: email,
    });

    return {
      participantId: participant.id,
    };
  }

  async updateParticipant(
    participantId: string,
    slug: string,
    eventSlug: string,
    userId: string,
    data: UpdateParticipantDto,
  ) {
    const { membership } = await this.permissions.getUserMembership(
      slug,
      userId,
    );

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('update', 'Participant')) {
      throw new ForbiddenException(
        `You're not allowed to update new participant.`,
      );
    }

    const { event } = await this.eventService.findBySlug(eventSlug);
    if (event.organizationId !== membership.organizationId) {
      throw new ForbiddenException(
        `You're not allowed to update new participant.`,
      );
    }

    const participant = await this.findById(participantId);
    if (participant.eventId !== event.id) {
      throw new ForbiddenException(
        `You're not allowed to update new participant.`,
      );
    }

    await this.prisma.participant.update({
      where: {
        id: participant.id,
      },
      data,
    });
  }

  async deleteParticipant(
    participantId: string,
    slug: string,
    eventSlug: string,
    userId: string,
  ) {
    const { membership } = await this.permissions.getUserMembership(
      slug,
      userId,
    );

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('delete', 'Participant')) {
      throw new ForbiddenException(
        `You're not allowed to update new participant.`,
      );
    }

    const { event } = await this.eventService.findBySlug(eventSlug);
    if (event.organizationId !== membership.organizationId) {
      throw new ForbiddenException(
        `You're not allowed to update new participant.`,
      );
    }

    const participant = await this.findById(participantId);
    if (participant.eventId !== event.id) {
      throw new ForbiddenException(
        `You're not allowed to update new participant.`,
      );
    }

    await this.prisma.participant.delete({
      where: {
        id: participant.id,
      },
    });
  }

  async getParticipants(slug: string, eventSlug: string, userId: string) {
    const { membership } = await this.permissions.getUserMembership(
      slug,
      userId,
    );

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('get', 'Participant')) {
      throw new ForbiddenException(`You're not allowed to get participant.`);
    }

    const { event } = await this.eventService.findBySlug(eventSlug);
    if (event.organizationId !== membership.organizationId) {
      throw new ForbiddenException(`You're not allowed to get participant.`);
    }

    const participants = await this.prisma.participant.findMany({
      where: {
        eventId: event.id,
      },
    });

    return { participants };
  }

  async findById(id: string, select?: Prisma.ParticipantSelect) {
    const participant = await this.prisma.participant.findUnique({
      select,
      where: {
        id,
      },
    });
    if (!participant) {
      throw new BadRequestException('Participant not found');
    }
    return participant;
  }

  async findByEmailAndEventId(
    email: string,
    eventId: string,
    select?: Prisma.ParticipantSelect,
  ) {
    const participant = await this.prisma.participant.findUnique({
      select,
      where: {
        email_eventId: {
          email,
          eventId,
        },
      },
    });
    return participant;
  }
}
