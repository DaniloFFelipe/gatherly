import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/database/prisma.service';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async getUserMembership(slug: string, userId: string) {
    const member = await this.prisma.member.findFirst({
      where: {
        userId,
        organization: {
          slug,
        },
      },
      include: {
        organization: true,
      },
    });

    if (!member) {
      throw new ForbiddenException(`You're not a member of this organization.`);
    }

    const { organization, ...membership } = member;

    return {
      organization,
      membership,
    };
  }
}
