/*
  Warnings:

  - You are about to drop the `LinkedInActionsSummary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LinkedInActionsSummary" DROP CONSTRAINT "LinkedInActionsSummary_linkedin_user_id_fkey";

-- DropTable
DROP TABLE "LinkedInActionsSummary";

-- CreateTable
CREATE TABLE "linkedin_actions_summary" (
    "id" SERIAL NOT NULL,
    "linkedin_user_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "action_date" DATE NOT NULL,
    "action_count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "linkedin_actions_summary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_linkedin_action_summary" ON "linkedin_actions_summary"("linkedin_user_id", "action", "action_date");

-- AddForeignKey
ALTER TABLE "linkedin_actions_summary" ADD CONSTRAINT "linkedin_actions_summary_linkedin_user_id_fkey" FOREIGN KEY ("linkedin_user_id") REFERENCES "linkedin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
