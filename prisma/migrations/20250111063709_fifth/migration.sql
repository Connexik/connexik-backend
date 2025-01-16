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
    "title" TEXT NOT NULL,
    "member_insights" TEXT NOT NULL,
    "ai_decision" TEXT NOT NULL,
    "ai_reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "linkedin_filters_request_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkedInActionsSummary" (
    "id" SERIAL NOT NULL,
    "linkedin_user_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "action_date" TIMESTAMP(3) NOT NULL,
    "action_count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LinkedInActionsSummary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "linkedin_filters_request" ADD CONSTRAINT "linkedin_filters_request_linkedin_user_id_fkey" FOREIGN KEY ("linkedin_user_id") REFERENCES "linkedin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linkedin_filters_request_data" ADD CONSTRAINT "linkedin_filters_request_data_linkedin_filters_request_id_fkey" FOREIGN KEY ("linkedin_filters_request_id") REFERENCES "linkedin_filters_request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkedInActionsSummary" ADD CONSTRAINT "LinkedInActionsSummary_linkedin_user_id_fkey" FOREIGN KEY ("linkedin_user_id") REFERENCES "linkedin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
