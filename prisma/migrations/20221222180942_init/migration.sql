/*
  Warnings:

  - You are about to drop the column `Loaction` on the `claim` table. All the data in the column will be lost.
  - Added the required column `Location` to the `Claim` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `claim` DROP COLUMN `Loaction`,
    ADD COLUMN `Location` VARCHAR(191) NOT NULL;
