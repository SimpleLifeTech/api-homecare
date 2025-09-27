/*
  Warnings:

  - You are about to drop the column `schedule` on the `patient_relationships` table. All the data in the column will be lost.
  - Added the required column `required_care_hours` to the `patient_relationships` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."patient_relationships" DROP COLUMN "schedule",
ADD COLUMN     "required_care_hours" INTEGER NOT NULL;
