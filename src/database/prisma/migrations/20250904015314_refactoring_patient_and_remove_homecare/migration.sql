/*
  Warnings:

  - You are about to drop the column `care_expires_at` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `care_hour` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `care_price` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `complexity` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `document` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `homecare_id` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `observation` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `homecare_id` on the `planning` table. All the data in the column will be lost.
  - You are about to drop the `homecare` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[person_id]` on the table `patient` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."AllowanceCostOrigin" AS ENUM ('SUPPLIER', 'HOMECARE', 'PATIENT_FAMILY', 'EMPLOYEE');

-- DropForeignKey
ALTER TABLE "public"."homecare" DROP CONSTRAINT "fk_branch";

-- DropForeignKey
ALTER TABLE "public"."patient" DROP CONSTRAINT "patient_homecare_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."planning" DROP CONSTRAINT "planning_homecare_id_fkey";

-- AlterTable
ALTER TABLE "public"."patient" DROP COLUMN "care_expires_at",
DROP COLUMN "care_hour",
DROP COLUMN "care_price",
DROP COLUMN "complexity",
DROP COLUMN "document",
DROP COLUMN "homecare_id",
DROP COLUMN "observation",
ADD COLUMN     "responsible_email" TEXT,
ADD COLUMN     "responsible_name" TEXT,
ADD COLUMN     "responsible_phone" TEXT;

-- AlterTable
ALTER TABLE "public"."planning" DROP COLUMN "homecare_id";

-- DropTable
DROP TABLE "public"."homecare";

-- CreateTable
CREATE TABLE "public"."patient_record" (
    "id" UUID NOT NULL,
    "patient_relationships_id" UUID NOT NULL,
    "action_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "attachment_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ,
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" UUID,

    CONSTRAINT "patient_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."patient_relationships" (
    "id" UUID NOT NULL,
    "supplier_id" UUID NOT NULL,
    "homecare_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "health_plan_id" UUID NOT NULL,
    "health_plan_payment" DOUBLE PRECISION NOT NULL,
    "homecare_payment" DOUBLE PRECISION NOT NULL,
    "schedule" INTEGER NOT NULL,
    "custom_fields" JSONB NOT NULL,
    "patient_record" TEXT NOT NULL,
    "notations" TEXT NOT NULL,
    "allowance_cost_origin" "public"."AllowanceCostOrigin" NOT NULL,
    "allowance_cost_price" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ,
    "updated_by" UUID,
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" UUID,

    CONSTRAINT "patient_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."health_plan" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "company_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "health_plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patient_person_id_key" ON "public"."patient"("person_id");

-- AddForeignKey
ALTER TABLE "public"."patient_record" ADD CONSTRAINT "patient_record_patient_relationships_id_fkey" FOREIGN KEY ("patient_relationships_id") REFERENCES "public"."patient_relationships"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."patient_relationships" ADD CONSTRAINT "patient_relationships_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."patient_relationships" ADD CONSTRAINT "patient_relationships_health_plan_id_fkey" FOREIGN KEY ("health_plan_id") REFERENCES "public"."health_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."patient_relationships" ADD CONSTRAINT "patient_relationships_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."patient_relationships" ADD CONSTRAINT "patient_relationships_homecare_id_fkey" FOREIGN KEY ("homecare_id") REFERENCES "public"."company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."health_plan" ADD CONSTRAINT "health_plan_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
