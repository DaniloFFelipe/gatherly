/*
  Warnings:

  - You are about to drop the column `slug` on the `instructors` table. All the data in the column will be lost.
  - You are about to drop the column `instructorId` on the `lessons` table. All the data in the column will be lost.
  - Added the required column `organization_id` to the `instructors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructor_id` to the `lessons` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_instructorId_fkey";

-- DropIndex
DROP INDEX "instructors_slug_key";

-- AlterTable
ALTER TABLE "instructors" DROP COLUMN "slug",
ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "instructorId",
ADD COLUMN     "instructor_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "instructors" ADD CONSTRAINT "instructors_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
