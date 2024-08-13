import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/database/prisma.service';
import { PermissionService } from 'src/modules/common/roles/permissions.service';
import { CreateInviteDto } from './create-invite.dto';
import { getUserPermissions } from 'src/modules/common/roles/utils';

@Injectable()
export class InvitesService {
  constructor(
    private prisma: PrismaService,
    private permissions: PermissionService,
  ) {}

  async createInvite(
    slug: string,
    userId: string,
    { email, role }: CreateInviteDto,
  ) {
    const { organization, membership } =
      await this.permissions.getUserMembership(slug, userId);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('create', 'Invite')) {
      throw new ForbiddenException(`You're not allowed to create new invites.`);
    }

    const [, domain] = email;

    if (
      organization.shouldAttachUsersByDomain &&
      domain !== organization.domain
    ) {
      throw new BadRequestException(
        `Users with '${domain}' domain will join your organization automatically on login.`,
      );
    }

    const inviteWithSameEmail = await this.prisma.invite.findUnique({
      where: {
        email_organizationId: {
          email,
          organizationId: organization.id,
        },
      },
    });

    if (inviteWithSameEmail) {
      throw new BadRequestException(
        'Another invite with same e-mail already exists.',
      );
    }

    const memberWithSameEmail = await this.prisma.member.findFirst({
      where: {
        organizationId: organization.id,
        user: {
          email,
        },
      },
    });

    if (memberWithSameEmail) {
      throw new BadRequestException(
        'A member with this e-mail already belongs to your organization.',
      );
    }

    const invite = await this.prisma.invite.create({
      data: {
        organizationId: organization.id,
        email,
        role,
        authorId: userId,
      },
    });

    return {
      inviteId: invite.id,
    };
  }

  async acceptInvite(inviteId: string, userId: string) {
    const invite = await this.prisma.invite.findUnique({
      where: {
        id: inviteId,
      },
    });

    if (!invite) {
      throw new BadRequestException('Invite not found or expired.');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    if (invite.email !== user.email) {
      throw new BadRequestException('This invite belongs to another user.');
    }

    await this.prisma.$transaction([
      this.prisma.member.create({
        data: {
          userId,
          organizationId: invite.organizationId,
          role: invite.role,
        },
      }),

      this.prisma.invite.delete({
        where: {
          id: invite.id,
        },
      }),
    ]);
  }

  async rejectInvite(inviteId: string, userId: string) {
    const invite = await this.prisma.invite.findUnique({
      where: {
        id: inviteId,
      },
    });

    if (!invite) {
      throw new BadRequestException('Invite not found or expired.');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    if (invite.email !== user.email) {
      throw new BadRequestException('This invite belongs to another user.');
    }

    await this.prisma.invite.delete({
      where: {
        id: invite.id,
      },
    });
  }

  async revokeInvite(inviteId: string, slug: string, userId: string) {
    const { organization, membership } =
      await this.permissions.getUserMembership(slug, userId);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('delete', 'Invite')) {
      throw new ForbiddenException(`You're not allowed to delete an invite.`);
    }

    const invite = await this.prisma.invite.findUnique({
      where: {
        id: inviteId,
        organizationId: organization.id,
      },
    });

    if (!invite) {
      throw new BadRequestException('Invite not found.');
    }

    await this.prisma.invite.delete({
      where: {
        id: inviteId,
      },
    });
  }

  async getInvites(slug: string, userId: string) {
    const { organization, membership } =
      await this.permissions.getUserMembership(slug, userId);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('get', 'Invite')) {
      throw new ForbiddenException(
        `You're not allowed to get organization invites.`,
      );
    }

    const invites = await this.prisma.invite.findMany({
      where: {
        organizationId: organization.id,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { invites };
  }

  async getPendingInvites(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const invites = await this.prisma.invite.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        organization: {
          select: {
            name: true,
          },
        },
      },
      where: {
        email: user.email,
      },
    });

    return { invites };
  }

  async getInvite(inviteId: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const invite = await this.prisma.invite.findUnique({
      where: {
        id: inviteId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        organization: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!invite || invite.email !== user.email) {
      throw new BadRequestException('Invite not found');
    }

    return { invite };
  }
}
