import { Cuisine,Location } from "@prisma/client";
import Link from "next/link";
import calculateReviewRatingAverage from "../../../utils/calculateReviewRatingAverage";
import Price from "../../components/Price";
import Stars from "../../components/Stars";
import Rating from "../../restaurant/[slug]/components/Rating";
import { RestaurantCardType } from "../page";

interface Props {
  restaurant: RestaurantCardType;
}

export default function RestaurantCard({restaurant}: Props){
  const renderRatingText = () => {
    let rating = calculateReviewRatingAverage(restaurant.reviews);
    rating = Math.ceil(rating);
    if(rating === 0) return "No reviews yet";
    if(rating === 1) return "Terrible";
    if(rating === 2) return "Bad";
    if(rating === 3) return "Good";
    if(rating === 4) return "Great";
    if(rating === 5) return "Awesome";
  }
    return(
        <div className="border-b flex pb-5 ml-4">
        
        <img
          src={restaurant.main_image}
          alt=""
          className="w-44 rounded"
        />
        <div className="pl-5">
          <h2 className="text-3xl">{restaurant.name}</h2>
          <div className="flex items-start">
            <div className="flex mb-2"><Stars reviews={restaurant.reviews} /></div>
            <p className="ml-2 text-sm">{renderRatingText()}</p>
          </div>
          <div className="mb-9">
            <div className="font-light flex text-reg">
              <p className="mr-4"><Price price={restaurant.price}/></p>
              <p className="mr-4 capitalize">{restaurant.cuisine.name}</p>
              <p className="mr-4 capitalize">{restaurant.location.name}</p>
            </div>
          </div>
          <div className="text-red-600">
            <Link href={"/restaurant/" + restaurant.slug}>
              View more information
            </Link>
          </div>
        </div>
   
      </div>
    )
}