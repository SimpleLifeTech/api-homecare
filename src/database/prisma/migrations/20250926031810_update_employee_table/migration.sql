/*
  Warnings:

  - You are about to drop the column `salary` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `work_shift` on the `employee` table. All the data in the column will be lost.
  - Added the required column `day_off_time` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `work_time` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Made the column `branch_id` on table `employee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `work_role` on table `employee` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."employee" DROP CONSTRAINT "employee_branch_id_fkey";

-- AlterTable
ALTER TABLE "public"."employee" DROP COLUMN "salary",
DROP COLUMN "work_shift",
ADD COLUMN     "day_off_time" INTEGER NOT NULL,
ADD COLUMN     "work_time" INTEGER NOT NULL,
ALTER COLUMN "branch_id" SET NOT NULL,
ALTER COLUMN "work_role" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."employee" ADD CONSTRAINT "employee_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
