-- CreateTable
CREATE TABLE `linkedin_users` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(256) NOT NULL,
    `last_name` VARCHAR(256) NOT NULL,
    `identifier` BIGINT UNSIGNED NOT NULL,
    `username` VARCHAR(128) NOT NULL,
    `title` VARCHAR(512) NULL,
    `last_scanned_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `linkedin_users_identifier_key`(`identifier`),
    UNIQUE INDEX `linkedin_users_username_key`(`username`),
    INDEX `idx_linkedin_user_identifier`(`identifier`),
    INDEX `idx_linkedin_user_username`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `linkedin_users_data` (
    `linkedin_user_id` INTEGER UNSIGNED NOT NULL,
    `location` VARCHAR(255) NULL,
    `summary` TEXT NULL,
    `experience` JSON NULL,
    `education` JSON NULL,
    `skills` JSON NULL,
    `recommendations` JSON NULL,
    `interests` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`linkedin_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `linkedin_users_data` ADD CONSTRAINT `linkedin_users_data_linkedin_user_id_fkey` FOREIGN KEY (`linkedin_user_id`) REFERENCES `linkedin_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
