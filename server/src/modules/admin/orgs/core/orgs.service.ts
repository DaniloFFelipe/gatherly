import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/database/prisma.service';
import { CreateOrgDto } from './dto/create-org.dto';
import { createSlug } from 'src/modules/common/utils/create-slug';
import { randomBytes } from 'crypto';
import { UpdateOrgDto } from './dto/update-org.dto';
import { PermissionService } from 'src/modules/common/roles/permissions.service';
import { organizationSchema } from 'src/modules/common/roles';
import { getUserPermissions } from 'src/modules/common/roles/utils';

@Injectable()
export class OrgsService {
  constructor(
    private prisma: PrismaService,
    private permissionService: PermissionService,
  ) {}

  async createOrganization(
    userId: string,
    { name, domain, shouldAttachUsersByDomain }: CreateOrgDto,
  ) {
    if (domain) {
      const organizationByDomain = await this.prisma.organization.findUnique({
        where: {
          domain,
        },
      });

      if (organizationByDomain) {
        throw new BadRequestException(
          'Another organization with same domain already exists.',
        );
      }
    }

    const organization = await this.prisma.organization.create({
      data: {
        name,
        slug: createSlug(name),
        domain,
        shouldAttachUsersByDomain,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'ADMIN',
          },
        },
      },
    });

    return {
      slug: organization.slug,
    };
  }

  async updateOrganization(
    slug: string,
    userId: string,
    { name, domain, shouldAttachUsersByDomain }: UpdateOrgDto,
  ) {
    const { membership, organization } =
      await this.permissionService.getUserMembership(slug, userId);

    const authOrganization = organizationSchema.parse(organization);

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('update', authOrganization)) {
      throw new ForbiddenException(
        `You're not allowed to update this organization.`,
      );
    }

    if (domain) {
      const organizationByDomain = await this.prisma.organization.findFirst({
        where: {
          domain,
          id: {
            not: organization.id,
          },
        },
      });

      if (organizationByDomain) {
        throw new BadRequestException(
          'Another organization with same domain already exists.',
        );
      }
    }

    await this.prisma.organization.update({
      where: {
        id: organization.id,
      },
      data: {
        name,
        domain,
        shouldAttachUsersByDomain,
      },
    });
  }

  async getOrganizations(userId: string) {
    const organizations = await this.prisma.organization.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        avatarUrl: true,
        members: {
          select: {
            role: true,
          },
          where: {
            userId,
          },
        },
      },
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
    });

    const organizationsWithUserRole = organizations.map(
      ({ members, ...org }) => {
        return {
          ...org,
          role: members[0].role,
        };
      },
    );

    return { organizations: organizationsWithUserRole };
  }

  async getOrganization(slug: string, userId: string) {
    const { organization } = await this.permissionService.getUserMembership(
      slug,
      userId,
    );
    return { organization };
  }
}
