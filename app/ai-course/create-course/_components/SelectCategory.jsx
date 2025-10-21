import { UserInputContext } from '../../../../app/ai-course/_context/UserInputContext';
import CategoryList from '../../../../app/ai-course/_shared/CategoryList'
import Image from 'next/image'
import React, { useContext } from 'react'

function SelectCategory() {
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);
  const handelCategoryChange = (category) => {
    setUserCourseInput(prev => ({
      ...prev,
      category: category
    }))
  }
  return (
    <div className='px-10 md:px-44'>
      <div className='grid grid-cols-3 gap-10'>
        {CategoryList.map((item, index) => (
          <div key={item.id} className={`flex flex-col p-10 border items-center rounded-xl hover:border-primary hover:bg-blue-50 cursor-pointer ${userCourseInput?.category == item.name && 'border-primary bg-blue-50'}`}
            onClick={() => handelCategoryChange(item.name)}>
            <Image src={item.icon} alt={item.name} width={60} height={80} />
            <p className='text-wrap'>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SelectCategory