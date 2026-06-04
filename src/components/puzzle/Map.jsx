import React, { forwardRef, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
//----------------------------------------------------------
//----------------------------------------------------------
const Map = forwardRef(({ place, images, isPlaced }, ref) => {
  const { setNodeRef } = useDroppable({
    id: place.id,
  });

  //----------------------------------------------------------
  return (
    <div key={place.id} ref={setNodeRef}>
      <div
        className={`relative overflow-hidden rounded-sm ${
          isPlaced
            ? "border border-transparent"
            : "border border-dashed border-amber-300 bg-amber-50/20"
        }`}
        style={
          !isPlaced
            ? {
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }
            : undefined
        }
      >
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