/*
  Warnings:

  - You are about to drop the column `document` on the `employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."branch" ALTER COLUMN "created_at" SET DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/Bahia'::text);

-- AlterTable
ALTER TABLE "public"."employee" DROP COLUMN "document",
ADD COLUMN     "criminal_record_url" TEXT,
ADD COLUMN     "personal_document_url" TEXT,
ADD COLUMN     "professional_document_url" TEXT,
ADD COLUMN     "resume_url" TEXT,
ADD COLUMN     "work_shift" TEXT;

-- CreateTable
CREATE TABLE "public"."department" (
    "id" UUID NOT NULL,
    "branch_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/Bahia'::text),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."department_employee" (
    "id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "feature" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/Bahia'::text),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "department_employee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."department" ADD CONSTRAINT "fk_branch" FOREIGN KEY ("branch_id") REFERENCES "public"."branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."department_employee" ADD CONSTRAINT "fk_department" FOREIGN KEY ("department_id") REFERENCES "public"."department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."department_employee" ADD CONSTRAINT "fk_employee" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
