/*
  Warnings:

  - You are about to drop the column `address` on the `company_fictional` table. All the data in the column will be lost.
  - You are about to drop the column `address_city` on the `company_fictional` table. All the data in the column will be lost.
  - You are about to drop the column `address_complement` on the `company_fictional` table. All the data in the column will be lost.
  - You are about to drop the column `address_number` on the `company_fictional` table. All the data in the column will be lost.
  - You are about to drop the column `address_state` on the `company_fictional` table. All the data in the column will be lost.
  - You are about to drop the column `address_zipcode` on the `company_fictional` table. All the data in the column will be lost.
  - You are about to drop the column `company_image_url` on the `company_fictional` table. All the data in the column will be lost.
  - You are about to drop the column `document` on the `company_fictional` table. All the data in the column will be lost.
  - Added the required column `branch_id` to the `company_fictional` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."company_relationships" DROP CONSTRAINT "fk_homecare";

-- DropForeignKey
ALTER TABLE "public"."company_relationships" DROP CONSTRAINT "fk_supplier";

-- AlterTable
ALTER TABLE "public"."company_fictional" DROP COLUMN "address",
DROP COLUMN "address_city",
DROP COLUMN "address_complement",
DROP COLUMN "address_number",
DROP COLUMN "address_state",
DROP COLUMN "address_zipcode",
DROP COLUMN "company_image_url",
DROP COLUMN "document",
ADD COLUMN     "branch_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "public"."company_relationships" ADD COLUMN     "homecare_fictional_id" UUID,
ADD COLUMN     "supplier_fictional_id" UUID,
ALTER COLUMN "homecare_id" DROP NOT NULL,
ALTER COLUMN "supplier_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."company_fictional" ADD CONSTRAINT "fk_branch" FOREIGN KEY ("branch_id") REFERENCES "public"."branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."company_relationships" ADD CONSTRAINT "fk_homecare" FOREIGN KEY ("homecare_id") REFERENCES "public"."company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."company_relationships" ADD CONSTRAINT "fk_supplier" FOREIGN KEY ("supplier_id") REFERENCES "public"."company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."company_relationships" ADD CONSTRAINT "fk_homecare_fictional" FOREIGN KEY ("homecare_fictional_id") REFERENCES "public"."company_fictional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."company_relationships" ADD CONSTRAINT "fk_supplier_fictional" FOREIGN KEY ("supplier_fictional_id") REFERENCES "public"."company_fictional"("id") ON DELETE SET NULL ON UPDATE CASCADE;
