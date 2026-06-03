import React, { forwardRef, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
//----------------------------------------------------------
//----------------------------------------------------------
const Map = forwardRef(({ place, images }, ref) => {
  //const ref = useRef();
  const { setNodeRef } = useDroppable({
    id: place.id,
  });

  //----------------------------------------------------------
  return (
    <div key={place.id} ref={setNodeRef}>
      <div className="border border-amber-100 bg-transparent">
        <img
          ref={ref}
          draggable={false}
          src={images[place.id]}
          alt=""
          className="max-w-[100%] opacity-0"
        />
      </div>
    </div>
  );
});

export default Map;