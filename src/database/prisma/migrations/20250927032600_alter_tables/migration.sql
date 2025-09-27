/*
  Warnings:

  - You are about to drop the column `work_role` on the `employee` table. All the data in the column will be lost.
  - Added the required column `work_role_id` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `month` on the `planning` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `year` on the `planning` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."service" DROP CONSTRAINT "service_patient_id_fkey";

-- AlterTable
ALTER TABLE "public"."employee" DROP COLUMN "work_role",
ADD COLUMN     "work_role_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "public"."planning" DROP COLUMN "month",
ADD COLUMN     "month" INTEGER NOT NULL,
DROP COLUMN "year",
ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."care_service_type" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/Bahia'::text),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "care_service_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."patient_service_needs" (
    "id" UUID NOT NULL,
    "work_role_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/Bahia'::text),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "patient_service_needs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."care_service_type" ADD CONSTRAINT "fk_company" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employee" ADD CONSTRAINT "employee_work_role_id_fkey" FOREIGN KEY ("work_role_id") REFERENCES "public"."care_service_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."patient_service_needs" ADD CONSTRAINT "fk_work_role" FOREIGN KEY ("work_role_id") REFERENCES "public"."care_service_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."patient_service_needs" ADD CONSTRAINT "fk_patient" FOREIGN KEY ("patient_id") REFERENCES "public"."patient_relationships"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."service" ADD CONSTRAINT "service_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patient_relationships"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
