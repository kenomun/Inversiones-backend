-- DropForeignKey
ALTER TABLE "InvestmentHistory" DROP CONSTRAINT "InvestmentHistory_projectId_fkey";

-- AlterTable
ALTER TABLE "InvestmentHistory" ALTER COLUMN "projectId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "InvestmentHistory" ADD CONSTRAINT "InvestmentHistory_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
