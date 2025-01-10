-- CreateTable
CREATE TABLE "linkedin_users" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(256) NOT NULL,
    "last_name" VARCHAR(256) NOT NULL,
    "identifier" BIGINT NOT NULL,
    "username" VARCHAR(128) NOT NULL,
    "title" VARCHAR(512),
    "last_scanned_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "linkedin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linkedin_users_data" (
    "linkedin_user_id" INTEGER NOT NULL,
    "location" VARCHAR(255),
    "summary" TEXT,
    "experience" JSON,
    "education" JSON,
    "skills" JSON,
    "recommendations" JSON,
    "interests" JSON,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "linkedin_users_data_pkey" PRIMARY KEY ("linkedin_user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "linkedin_users_identifier_key" ON "linkedin_users"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "linkedin_users_username_key" ON "linkedin_users"("username");

-- CreateIndex
CREATE INDEX "idx_linkedin_user_identifier" ON "linkedin_users"("identifier");

-- CreateIndex
CREATE INDEX "idx_linkedin_user_username" ON "linkedin_users"("username");

-- AddForeignKey
ALTER TABLE "linkedin_users_data" ADD CONSTRAINT "linkedin_users_data_linkedin_user_id_fkey" FOREIGN KEY ("linkedin_user_id") REFERENCES "linkedin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
