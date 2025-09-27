/*
  Warnings:

  - Added the required column `branch_id` to the `planning` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."planning" ADD COLUMN     "branch_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."planning" ADD CONSTRAINT "planning_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
