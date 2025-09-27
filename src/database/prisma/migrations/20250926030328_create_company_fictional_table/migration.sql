-- AlterTable
ALTER TABLE "public"."patient_relationships" ADD COLUMN     "fictional_homecare_id" UUID,
ADD COLUMN     "fictional_supplier_id" UUID;

-- CreateTable
CREATE TABLE "public"."company_fictional" (
    "id" UUID NOT NULL,
    "type" "public"."CompanyType" NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "company_image_url" VARCHAR(255),
    "address" TEXT NOT NULL,
    "address_number" TEXT NOT NULL,
    "address_complement" TEXT,
    "address_city" TEXT NOT NULL,
    "address_state" TEXT NOT NULL,
    "address_zipcode" TEXT NOT NULL,
    "document" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/Bahia'::text),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "company_fictional_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."patient_relationships" ADD CONSTRAINT "patient_relationships_homecare_id_fkey" FOREIGN KEY ("homecare_id") REFERENCES "public"."company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."patient_relationships" ADD CONSTRAINT "patient_relationships_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."patient_relationships" ADD CONSTRAINT "patient_relationships_fictional_homecare_id_fkey" FOREIGN KEY ("fictional_homecare_id") REFERENCES "public"."company_fictional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."patient_relationships" ADD CONSTRAINT "patient_relationships_fictional_supplier_id_fkey" FOREIGN KEY ("fictional_supplier_id") REFERENCES "public"."company_fictional"("id") ON DELETE SET NULL ON UPDATE CASCADE;
