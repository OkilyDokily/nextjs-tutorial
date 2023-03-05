import { Cuisine,Location, PRICE } from "@prisma/client";
import Link from "next/link";


interface Props {
  cuisines: Cuisine[];
  regions: Location[];
  searchParams: {city?: string,price?: PRICE, cuisine?: string}
}
const prices =
[{
  price: PRICE.CHEAP,
  label:"$$",
  classes:"border w-full text-reg font-light rounded-l p-2"
}
,{
  price: PRICE.REGULAR,
  label:"$$$",
  classes:"border w-full text-reg font-light p-2"
}
,{
  price: PRICE.EXPENSIVE,
  label:"$$$$",
  classes:"border w-full text-center text-reg font-light rounded-r p-2"
}
];

export default function SearchSideBar({cuisines,regions,searchParams}: Props){
    return(
        <div className="w-1/5">
        <div className="border-b pb-4 flex flex-col">
          <h1 className="mb-2">Region</h1>
          {regions.map((region) => (
            <Link href={
              {
                pathname: "/search",
                query: {
                  ...searchParams,
                  city: region.name,
              }
            }
            }
             key={region.id} className="font-light text-reg">{region.name}</Link>      
          ))}
      
        </div>
        <div className="border-b pb-4 mt-3 flex flex-col">
          <h1 className="mb-2">Cuisine</h1>
          {cuisines.map((cuisine) => (
            <Link href={
              {
                pathname: "/search",
                query: {
                  ...searchParams,
                  cuisine: cuisine.name,
                }
            }
            }
              key={cuisine.id} className="font-light text-reg">{cuisine.name}
            </Link>
          ))}
       
        </div>
        <div className="mt-3 pb-4">
          <h1 className="mb-2">Price</h1>
          <div className="flex">
            {prices.map((price) => (
            <Link
              href={
                {
                  pathname: "/search",
                  query: {
                    ...searchParams,
                    price:price.price,
                  }
                }
              }
              
            className={price.classes}>
              {price.label}
            </Link>  
            ))} 
            
          </div>
        </div>
      </div>
    )
}