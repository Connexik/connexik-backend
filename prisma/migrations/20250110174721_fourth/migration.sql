/*
  Warnings:

  - The `location` column on the `linkedin_users_data` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "linkedin_users_data" DROP COLUMN "location",
ADD COLUMN     "location" JSON;
