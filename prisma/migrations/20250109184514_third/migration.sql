/*
  Warnings:

  - You are about to alter the column `identifier` on the `linkedin_users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "linkedin_users" ALTER COLUMN "identifier" SET DATA TYPE INTEGER;
