/*
  Warnings:

  - Added the required column `full_name` to the `linkedin_filters_request_data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "linkedin_filters_request_data" ADD COLUMN     "full_name" TEXT NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "member_insights" DROP NOT NULL;
