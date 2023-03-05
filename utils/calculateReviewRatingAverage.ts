import { Review } from "@prisma/client";

export default function calculateReviewRatingAverage(reviews: Review[]) {
    if (!reviews?.length) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
}