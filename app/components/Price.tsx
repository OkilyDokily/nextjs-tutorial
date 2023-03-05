import { PRICE } from '@prisma/client'
import React from 'react'

export default function Price({price}:{price:PRICE}) {
    const renderPrice = () => {
        switch(price){
            case PRICE.CHEAP: return (<><span>$$</span><span className='text-gray-400'>$$</span></>)
            case PRICE.REGULAR: return (<><span>$$$</span><span className='text-gray-400'>$</span></>)
            case PRICE.EXPENSIVE: return (<><span>$$$$</span></>)
        } 
    }
  return renderPrice();
}
