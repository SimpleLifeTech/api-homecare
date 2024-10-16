-- CreateTable
CREATE TABLE "person" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "address_number" TEXT NOT NULL,
    "address_complement" TEXT,
    "address_city" TEXT NOT NULL,
    "address_state" TEXT NOT NULL,
    "address_zipcode" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);
