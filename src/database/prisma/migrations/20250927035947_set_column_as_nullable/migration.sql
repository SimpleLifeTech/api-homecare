-- DropForeignKey
ALTER TABLE "public"."service" DROP CONSTRAINT "service_employee_id_fkey";

-- AlterTable
ALTER TABLE "public"."service" ALTER COLUMN "employee_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."service" ADD CONSTRAINT "service_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
