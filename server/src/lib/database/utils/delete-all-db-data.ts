import { PrismaClient } from '@prisma/client';

export async function deleteAllDBData(prisma: PrismaClient) {
  await prisma.$transaction(async (t) => {
    await t.invite.deleteMany();
    await t.lesson.deleteMany();
    await t.instructor.deleteMany();
    await t.participant.deleteMany();
    await t.event.deleteMany();
    await t.token.deleteMany();
    await t.member.deleteMany();
    await t.account.deleteMany();
    await t.organization.deleteMany();
  });
}
