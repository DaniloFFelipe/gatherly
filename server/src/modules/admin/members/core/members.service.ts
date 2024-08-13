import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/database/prisma.service';
import { PermissionService } from 'src/modules/common/roles/permissions.service';
import { getUserPermissions } from 'src/modules/common/roles/utils';

@Injectable()
export class MembersService {
  constructor(
    private prisma: PrismaService,
    private permissions: PermissionService,
  ) {}

  async getMembers(slug: string, userId: string) {
    const { organization, membership } =
      await this.permissions.getUserMembership(slug, userId);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('get', 'User')) {
      throw new ForbiddenException(
        `You're not allowed to see organization members.`,
      );
    }

    const members = await this.prisma.member.findMany({
      select: {
        id: true,
        role: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      where: {
        organizationId: organization.id,
      },
      orderBy: {
        role: 'asc',
      },
    });

    const membersWithRoles = members.map(
      ({ user: { id: userId, ...user }, ...member }) => {
        return {
          ...user,
          ...member,
          userId,
        };
      },
    );

    return { members: membersWithRoles };
  }

  async removeMember(memberId: string, slug: string, userId: string) {
    const { organization, membership } =
      await this.permissions.getUserMembership(slug, userId);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('delete', 'User')) {
      throw new ForbiddenException(
        `You're not allowed to remove this member from organization.`,
      );
    }

    await this.prisma.member.delete({
      where: {
        id: memberId,
        organizationId: organization.id,
      },
    });
  }
}
