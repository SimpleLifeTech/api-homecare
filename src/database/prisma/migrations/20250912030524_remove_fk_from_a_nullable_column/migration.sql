-- DropForeignKey
ALTER TABLE "public"."patient_relationships" DROP CONSTRAINT "patient_relationships_health_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."patient_relationships" DROP CONSTRAINT "patient_relationships_homecare_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."patient_relationships" DROP CONSTRAINT "patient_relationships_supplier_id_fkey";
