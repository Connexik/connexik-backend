/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `linkedin_users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `linkedin_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "linkedin_users" ADD COLUMN     "uuid" VARCHAR(128) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "linkedin_users_uuid_key" ON "linkedin_users"("uuid");
