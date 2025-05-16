import React from 'react'
import { categories } from '../assets/assets.js'
import { useAppContext } from '../context/AppContext.jsx'; 

const Categories = () => {
  const { navigate } = useAppContext();

  return (
    <div className='mt-12 px-4 sm:px-6'> 
      <p className='text-xl sm:text-2xl md:text-3xl font-medium text-center sm:text-left'> 
        Categories
      </p>

      <div
        className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 mt-6'
      > 

        {categories.map((category, index) => (
          <div
            key={index}
            className='group cursor-pointer py-4 px-2 sm:px-3 rounded-lg flex flex-col items-center text-center transition duration-200'
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
          >
            <img
              src={category.image}
              alt={category.text}
              className='group-hover:scale-110 transition-transform duration-300 ease-in-out w-16 sm:w-20 md:w-24 h-auto object-contain' // updated scaling + size
            />
            <p className='text-sm sm:text-base font-medium mt-2'>{category.text}</p> 
          </div>
        ))}

      </div>
    </div>
  )
}

export default Categories;