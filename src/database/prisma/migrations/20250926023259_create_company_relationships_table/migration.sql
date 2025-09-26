-- CreateTable
CREATE TABLE "public"."company_relationships" (
    "id" UUID NOT NULL,
    "homecare_id" UUID NOT NULL,
    "supplier_id" UUID NOT NULL,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'America/Bahia'::text),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "company_relationships_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."company_relationships" ADD CONSTRAINT "fk_homecare" FOREIGN KEY ("homecare_id") REFERENCES "public"."company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."company_relationships" ADD CONSTRAINT "fk_supplier" FOREIGN KEY ("supplier_id") REFERENCES "public"."company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
