
import RestaurantCard from "./components/RestaurantCard";
import Header from "./components/Header";
import SearchSideBar from "./components/SearchSideBar";
import { Cuisine, PRICE, PrismaClient,Location, Review } from "@prisma/client";

export interface RestaurantCardType {
  id: number;
  name: string;
  main_image: string;
  slug: string;
  price: PRICE;
  location:Location;
  cuisine:Cuisine;
  reviews: Review[];
}

const prismaClient = new PrismaClient();

const fetchCuisines = async () => {
  const cuisines = await prismaClient.cuisine.findMany();
  return cuisines;
};

const fetchRegions = async () => {
  const regions = await prismaClient.location.findMany();
  return regions;
}; 

const getRestaurants = async ({city,cuisine,price}:{city?: string,price?: PRICE, cuisine?: string}) => {
    const select = {
        id: true,
        name: true,
        main_image: true,
        slug: true,
        price: true,
        location: true,
        cuisine: true,
        reviews: true
    }
    const where:any = {};
    
    if(!city) return await prismaClient.restaurant.findMany({select});
    if(city)  {
      where.location =
      {    
          name: {
            contains: city,
            mode: "insensitive"
          }
      }
      
    }
    if(cuisine) {
      where.cuisine = {
          name: {
            contains: cuisine,
            mode: "insensitive"
          }
        }
      }
    
    if(price) {
      where.price = {
          equals: price
        }
    }

    const restaurants = await prismaClient.restaurant.findMany({
        where: where, 
        select
    });
    return restaurants;
}

export default async function Search({searchParams}: {searchParams: {city?: string,price?: PRICE, cuisine?: string}}){
    const restaurants = await getRestaurants(searchParams);
    const cuisines = await fetchCuisines();
    const regions = await fetchRegions();
    return (
  <>
   <Header/>
    <div className="flex py-4 m-auto w-2/3 justify-between items-start">
      <SearchSideBar cuisines={cuisines} regions={regions} searchParams={searchParams} />
      <div className="w-5/6">
       { restaurants.length > 0 ? restaurants.map((restaurant) => {
            return <RestaurantCard restaurant={restaurant}/>
        })
        : <p className="text-center">No restaurants found</p>
        }
      </div>
    </div>
    </>

    );
}