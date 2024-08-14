import { faker } from '@faker-js/faker';

import { AuthService } from 'src/lib/auth/auth.service';
import { PrismaService } from 'src/lib/database/prisma.service';
import { deleteAllDBData } from 'src/lib/database/utils/delete-all-db-data';
import { EventsService } from 'src/modules/admin/events/core/events.service';
import { InstructorsService } from 'src/modules/admin/instructors/core/instructors.service';
import { CreateLessonDto } from 'src/modules/admin/lessons/core/dto/create-lesson.dto';
import { LessonsService } from 'src/modules/admin/lessons/core/lessons.service';
import { OrgsService } from 'src/modules/admin/orgs/core/orgs.service';
import { ParticipantsService } from 'src/modules/admin/participants/core/participants.service';
import { UsersService } from 'src/modules/admin/users/core/users.service';
import { PermissionService } from 'src/modules/common/roles/permissions.service';

const prisma = new PrismaService();
const permissions = new PermissionService(prisma);
const userService = new UsersService(prisma, {} as AuthService);
const orgService = new OrgsService(prisma, permissions);
const eventService = new EventsService(prisma, permissions);
const lessonsService = new LessonsService(prisma, permissions, eventService);
const instructorsService = new InstructorsService(prisma, permissions);
const participantService = new ParticipantsService(
  prisma,
  permissions,
  eventService,
  {
    async sendMail() {},
  },
);

export async function main() {
  await deleteAllDBData(prisma);

  const user = await userService.createAccount({
    email: 'user@acme.com',
    name: 'User',
    password: '123123',
  });
  const { slug } = await orgService.createOrganization(user.id, {
    name: 'Org One',
    domain: 'acme.com',
    shouldAttachUsersByDomain: true,
  });
  const { slug: eventSlug } = await eventService.createEvent(slug, user.id, {
    avatarUrl: faker.image.urlPicsumPhotos(),
    description: faker.lorem.paragraph(),
    name: faker.commerce.productName(),
  });
  const { instructorId } = await instructorsService.createInstructor(
    slug,
    user.id,
    {
      avatarUrl: faker.image.avatarGitHub(),
      description: faker.person.bio(),
      name: faker.person.firstName() + ' ' + faker.person.lastName(),
    },
  );
  const lesson: CreateLessonDto[] = Array.from({ length: 4 }).map((_, idx) => {
    return {
      contentUrl:
        'http://localhost:4020/assets/a83d27fe-c772-4a7c-b5d1-3484fea6eba7/stream',
      description: faker.lorem.paragraph(),
      name: 'Aula ' + (idx + 1),
      instructorId,
    };
  });
  await Promise.all(
    lesson.map((l) => lessonsService.createLesson(slug, eventSlug, user.id, l)),
  );
  await participantService.createParticipant(slug, eventSlug, user.id, {
    email: 'user@acme.com',
    name: 'User',
  });
}

main().finally(() => {
  prisma.$disconnect();
});
