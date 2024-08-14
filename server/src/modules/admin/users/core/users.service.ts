import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/database/prisma.service';
import { CreateAccountDto } from './dtos/create-account.dto';
import { compare, hash } from 'bcrypt';
import { AuthWithPasswordDto } from './dtos/auth-with-password.dto';
import { AuthService } from 'src/lib/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async createAccount({ email, name, password }: CreateAccountDto) {
    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new BadRequestException('User with same e-mail already exists.');
    }

    const [, domain] = email.split('@');

    const autoJoinOrganization = await this.prisma.organization.findFirst({
      where: {
        domain,
        shouldAttachUsersByDomain: true,
      },
    });

    const passwordHash = await hash(password, 6);

    return await this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        member_on: autoJoinOrganization
          ? {
              create: {
                organizationId: autoJoinOrganization.id,
              },
            }
          : undefined,
      },
    });
  }

  async authWithPassword({ email, password }: AuthWithPasswordDto) {
    const userFromEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!userFromEmail) {
      throw new BadRequestException('Invalid credentials.');
    }

    if (userFromEmail.passwordHash === null) {
      throw new BadRequestException(
        'User does not have a password, use social login.',
      );
    }

    const isPasswordValid = await compare(password, userFromEmail.passwordHash);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials.');
    }

    const token = await this.authService.sign(userFromEmail.id);

    return {
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    return { user };
  }
}
