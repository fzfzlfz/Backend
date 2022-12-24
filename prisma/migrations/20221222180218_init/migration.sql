/*
  Warnings:

  - You are about to drop the `claims` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `claims`;

-- CreateTable
CREATE TABLE `Claim` (
    `id` VARCHAR(191) NOT NULL,
    `insuranceId` VARCHAR(191) NOT NULL,
    `Date` VARCHAR(191) NOT NULL,
    `Loaction` VARCHAR(191) NOT NULL,
    `Amount` VARCHAR(191) NOT NULL,
    `userid` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
