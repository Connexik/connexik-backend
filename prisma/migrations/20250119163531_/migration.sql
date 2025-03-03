-- CreateTable
CREATE TABLE "auth_users" (
    "id" VARCHAR(128) NOT NULL,
    "sub" VARCHAR(128) NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "first_name" VARCHAR(256) NOT NULL,
    "last_name" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linkedin_users" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(128) NOT NULL,
    "auth_user_id" TEXT NOT NULL,
    "first_name" VARCHAR(256) NOT NULL,
    "last_name" VARCHAR(256) NOT NULL,
    "identifier" INTEGER NOT NULL,
    "username" VARCHAR(128) NOT NULL,
    "title" VARCHAR(512),
    "last_scanned_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "linkedin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linkedin_users_data" (
    "linkedin_user_id" INTEGER NOT NULL,
    "location" JSON,
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

-- CreateTable
CREATE TABLE "linkedin_filters_request" (
    "id" SERIAL NOT NULL,
    "linkedin_user_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "filters" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "linkedin_filters_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linkedin_filters_request_data" (
    "id" SERIAL NOT NULL,
    "linkedin_filters_request_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "title" TEXT,
    "member_insights" TEXT,
    "ai_decision" TEXT NOT NULL,
    "ai_reason" TEXT NOT NULL,
    "ai_confidence" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "linkedin_filters_request_data_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "auth_users_sub_key" ON "auth_users"("sub");

-- CreateIndex
CREATE INDEX "idx_auth_user_sub" ON "auth_users"("sub");

-- CreateIndex
CREATE UNIQUE INDEX "linkedin_users_uuid_key" ON "linkedin_users"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "linkedin_users_identifier_key" ON "linkedin_users"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "linkedin_users_username_key" ON "linkedin_users"("username");

-- CreateIndex
CREATE INDEX "idx_linkedin_user_identifier" ON "linkedin_users"("identifier");

-- CreateIndex
CREATE INDEX "idx_linkedin_user_username" ON "linkedin_users"("username");

-- CreateIndex
CREATE INDEX "idx_linkedin_action_summary" ON "linkedin_actions_summary"("linkedin_user_id", "action", "action_date");

-- AddForeignKey
ALTER TABLE "linkedin_users" ADD CONSTRAINT "linkedin_users_auth_user_id_fkey" FOREIGN KEY ("auth_user_id") REFERENCES "auth_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linkedin_users_data" ADD CONSTRAINT "linkedin_users_data_linkedin_user_id_fkey" FOREIGN KEY ("linkedin_user_id") REFERENCES "linkedin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linkedin_filters_request" ADD CONSTRAINT "linkedin_filters_request_linkedin_user_id_fkey" FOREIGN KEY ("linkedin_user_id") REFERENCES "linkedin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linkedin_filters_request_data" ADD CONSTRAINT "linkedin_filters_request_data_linkedin_filters_request_id_fkey" FOREIGN KEY ("linkedin_filters_request_id") REFERENCES "linkedin_filters_request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linkedin_actions_summary" ADD CONSTRAINT "linkedin_actions_summary_linkedin_user_id_fkey" FOREIGN KEY ("linkedin_user_id") REFERENCES "linkedin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
