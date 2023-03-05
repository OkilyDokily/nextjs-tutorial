import React from 'react'
import Header from './components/Header'

export default function loading() {
  return (
    <main>
      <Header/>
            <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
            {[1,2,3,4,5,6,7,8,9,10,11,12].map((item,index)=><div key={index} className="animate-pulse w-64 h-72 bg-slate-200 rounded overflow-hidden border cursor-pointer m-3 mr-4 mb-4"></div>)
            }
            </div>
     
    </main>
    
  )
}
