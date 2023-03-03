import React from 'react';
import { data } from 'components/CourseList';
import CourseItem from './courseItem';

export default function CourseDrawer() {
  return (
    <>
      <div className="relative flex items-center bg-gradient-to-t from-blue-300 via-fuschia-400 to-blue-300">
        <div
          className="flex flex-row w-full h-full overflow-x-scroll scroll whitespace-nowrap snap-center"
        >
          {data.map((item) => (
            <CourseItem item={item}
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
