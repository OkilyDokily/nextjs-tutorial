import { PrismaClient } from "@prisma/client";
import Menu from "../components/Menu";
import RestaurantNavBar from "../components/RestaurantNavBar";

const prism = new PrismaClient();

const fetchMenuItems = async (slug: string) => {

  const restaurant = await prism.restaurant.findUnique({
    where: {
      slug: slug,
    },
    select: {
      items:true
    }});
    if(!restaurant) throw new Error("Restaurant not found");
  return restaurant.items;
};

export default async function RestaurantMenu({params}: {params: {slug: string}}){
    const items = await fetchMenuItems(params.slug);
    return(
<>
      <div className="bg-white w-[100%] rounded p-3 shadow">
        <RestaurantNavBar slug={params.slug}/>
        <Menu items={items}/>
      </div>
    </>
    )
}