

import { PrismaClient, Review } from "@prisma/client"
import { notFound } from "next/navigation"
import Description from "./components/Description"
import Header from "./components/Header"
import Images from "./components/Images"
import Rating from "./components/Rating"
import ReservationCard from "./components/ReservationCard"
import RestaurantNavBar from "./components/RestaurantNavBar"
import Reviews from "./components/Reviews"
import Title from "./components/Title"

const prism = new PrismaClient();

interface RestaurantType {
  id: number;
  name: string;
  images: string[];
  slug: string;
  description: string;
  reviews: Review[],
  open_time: string;
  close_time: string;
}

const fetchRestaurantBySlug = async (slug: string):Promise<RestaurantType>=> {
  const restaurant = await prism.restaurant.findUnique({
    where: {
      slug: slug
    },
    select: {
      id: true,
      name: true,
      images: true,
      slug: true,
      description: true,
      reviews: true,
      open_time: true,
      close_time: true,
    }
  });
  if(!restaurant){
    notFound();
  } 
  return restaurant;
}

export default async function RestaurantDetails({params}:{params:{slug:string}}) {
  const restaurant = await fetchRestaurantBySlug(params.slug);
    return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow">
        <RestaurantNavBar slug={restaurant.slug}/>
        <Title title={restaurant.name}/> 
        <Rating reviews={restaurant.reviews}/>
        <Description description={restaurant.description}/>
        <Images images={restaurant.images}/>
        <Reviews reviews={restaurant.reviews}/>
      </div>
      <div className="w-[27%] relative text-reg">
        <ReservationCard openTime={restaurant.open_time} closeTime={restaurant.close_time} slug={restaurant.slug}/>
      </div>
    </>

    )
}