-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "images" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "post_count" BIGINT NOT NULL DEFAULT 0;
