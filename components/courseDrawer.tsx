import React from 'react';
import { data } from 'course-Images/images';

export default function CourseDrawer() {
  return (
    <>
      <div className="relative flex items-center">
        <div
          id="slider"
          className="w-full h-full overflow-x-scroll scroll whitespace-nowrap snap-center"
        >
          {data.map((item) => (
            <img
              className="w-[220px] inline-block p-2 cursor-pointer hover:scale-105 ease-in-out duration-300"
              src={item.img}
              alt="/"
            />
          ))}
        </div>
      </div>
    </>
  );
}

/* Course Component
- Image + Title and casing of the image. */
/*const course*/
