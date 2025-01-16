/*
  Warnings:

  - Added the required column `ai_confidence` to the `linkedin_filters_request_data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "linkedin_filters_request_data" ADD COLUMN     "ai_confidence" INTEGER NOT NULL;
