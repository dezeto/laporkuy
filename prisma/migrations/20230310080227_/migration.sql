/*
  Warnings:

  - A unique constraint covering the columns `[subjectId]` on the table `Fraudster` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Fraudster_subjectId_key" ON "Fraudster"("subjectId");
