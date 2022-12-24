-- CreateTable
CREATE TABLE `Claims` (
    `id` VARCHAR(191) NOT NULL,
    `insuranceId` VARCHAR(191) NOT NULL,
    `Date` VARCHAR(191) NOT NULL,
    `Loaction` VARCHAR(191) NOT NULL,
    `Amount` VARCHAR(191) NOT NULL,
    `userid` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Insurance` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `LastName` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `vtype` VARCHAR(191) NOT NULL,
    `vprice` VARCHAR(191) NOT NULL,
    `liscenceN` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `collision` BOOLEAN NOT NULL,
    `userid` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
