/*
  Warnings:

  - You are about to drop the column `enddate` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "enddate",
ADD COLUMN     "endDate" TIMESTAMP(3);
