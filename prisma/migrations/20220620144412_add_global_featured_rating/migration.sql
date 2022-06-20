-- CreateTable
CREATE TABLE "FeaturedRating" (
    "ratingId" INTEGER NOT NULL,

    CONSTRAINT "FeaturedRating_pkey" PRIMARY KEY ("ratingId")
);

-- AddForeignKey
ALTER TABLE "FeaturedRating" ADD CONSTRAINT "FeaturedRating_ratingId_fkey" FOREIGN KEY ("ratingId") REFERENCES "Rating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
