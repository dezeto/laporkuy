/*
  Warnings:

  - You are about to drop the column `subjectId` on the `Fraudster` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Fraudster_subjectId_key";

-- AlterTable
ALTER TABLE "Fraudster" DROP COLUMN "subjectId";
