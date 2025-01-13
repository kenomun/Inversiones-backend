/*
  Warnings:

  - You are about to drop the column `targetAmount` on the `Project` table. All the data in the column will be lost.
  - Added the required column `capacity` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minInvestment` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnType` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "targetAmount",
ADD COLUMN     "capacity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "fixedReturn" DOUBLE PRECISION,
ADD COLUMN     "minInvestment" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "returnType" TEXT NOT NULL;
