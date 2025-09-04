-- DropForeignKey
ALTER TABLE "public"."patient_relationships" DROP CONSTRAINT "patient_relationships_health_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."patient_relationships" DROP CONSTRAINT "patient_relationships_homecare_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."patient_relationships" DROP CONSTRAINT "patient_relationships_supplier_id_fkey";

-- AlterTable
ALTER TABLE "public"."patient_relationships" ALTER COLUMN "supplier_id" DROP NOT NULL,
ALTER COLUMN "homecare_id" DROP NOT NULL,
ALTER COLUMN "health_plan_id" DROP NOT NULL,
ALTER COLUMN "health_plan_payment" DROP NOT NULL,
ALTER COLUMN "homecare_payment" DROP NOT NULL,
ALTER COLUMN "custom_fields" DROP NOT NULL,
ALTER COLUMN "patient_record" DROP NOT NULL,
ALTER COLUMN "notations" DROP NOT NULL,
ALTER COLUMN "allowance_cost_origin" SET DEFAULT 'PATIENT_FAMILY';

-- AddForeignKey
ALTER TABLE "public"."patient_relationships" ADD CONSTRAINT "patient_relationships_health_plan_id_fkey" FOREIGN KEY ("health_plan_id") REFERENCES "public"."health_plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."patient_relationships" ADD CONSTRAINT "patient_relationships_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."patient_relationships" ADD CONSTRAINT "patient_relationships_homecare_id_fkey" FOREIGN KEY ("homecare_id") REFERENCES "public"."company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
