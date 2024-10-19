-- CreateTable
CREATE TABLE "person_permission" (
    "id" UUID NOT NULL,
    "person_id" TEXT NOT NULL,
    "role_permission_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "person_permission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "person_permission" ADD CONSTRAINT "person_permission_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_permission" ADD CONSTRAINT "person_permission_role_permission_id_fkey" FOREIGN KEY ("role_permission_id") REFERENCES "role_permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
