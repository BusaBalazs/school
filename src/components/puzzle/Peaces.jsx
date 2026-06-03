import React, { useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

//----------------------------------------------------------
//----------------------------------------------------------
const Peaces = ({ images, peace }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: peace.id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    touchAction: "none", // Ensures touch events work properly on mobile
  };

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = "grabbing";
    } else {
      document.body.style.cursor = "";
    }
  }, [isDragging]);

  //----------------------------------------------------------
  return (
    <img
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      style={style}
      src={images[peace.id]}
      alt=""
      className="max-w-[100%]"
    />
  );
};

export default Peaces;