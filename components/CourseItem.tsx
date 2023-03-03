import React from 'react';
/*Add truncation for overflowing description*/
/*Find something better than using a mb-6 to make the description close to the title*/

const CourseItem = ({
  item,
}: {
  item: { id: number; img: string; title: string };
}) => {
  return (
    <div className="snap-x w-[16rem] flex-none cursor-pointer relative m-2 mb-3">
      <img className="w-full h-auto block" src={item.img} alt={item.title} />
      <div className="whitespace-normal flex-initial flex flex-col bg-black w-full h-[4rem]">
        <p className="whitespace-normal text-base font-bold flex justify-center items-center h-full text-center text-white mr-2 ml-2">
          {item.title}
        </p>
      </div>
      <div className="absolute top-0 left-0 w-full bg-gradient-to-t from-black via-transparent h-[12rem]"></div>
      <div className="transition duration-800 absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-black hover:opacity-100 opacity-0 text-white h-[16rem]">
        <div className="flex absolute bottom-0 flex-initial flex-col bg-black w-full h-[8rem] items-top">
          <h1 className="whitespace-normal text-s font-bold flex h-full text-left mr-2 ml-2 mt-1">
            {item.title}
          </h1>
          <p className="whitespace-normal text-clip text-xs flex justify-left h-full text-left text-white mb-6 ml-2 mr-2">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseItem;
