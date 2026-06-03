import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DndContext } from "@dnd-kit/core";

import Map from "./Map";
import Peaces from "./Peaces";
import { images } from "../../assets/index";

const PLACES = [
  { id: 0 },
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
];

//----------------------------------------------------------
//----------------------------------------------------------
const Puzzle = () => {
  const activeRef = useRef([]);
  const [isOver, setIsOver] = useState([]);
  const [mapPeaces, setMapPeaces] = useState([
    { id: 2, status: "ready", isTrue: true },
    { id: 5, status: "ready", isTrue: true },
    { id: 1, status: "ready", isTrue: true },
    { id: 8, status: "ready", isTrue: true },
    { id: 0, status: "ready", isTrue: true },
    { id: 3, status: "ready", isTrue: true },
    { id: 4, status: "ready", isTrue: true },
    { id: 7, status: "ready", isTrue: true },
    { id: 6, status: "ready", isTrue: true },
  ]);

  //----------------------------------------------------------
  useGSAP(() => {
    gsap.fromTo(
      ".gsap-place",
      { opacity: 0 },
      { opacity: 1, duration: 0.5, delay: 0.4 },
    );

    gsap.fromTo(
      ".gsap-cards",
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 0.4 },
    );
  });
  //----------------------------------------------------------
  //----------------------------------------------------------
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) {
      setIsOver((prev) => [...prev, active.id]);
      activeRef.current[active.id].style.opacity = "1";
      activeRef.current[active.id].parentElement.style.border = "none";
      setMapPeaces((prev) => {
        const updatedPeaces = prev.map((peace) => {
          if (peace.id === active.id) {
            return { ...peace, status: "placed" };
          }
          return peace;
        });
        return updatedPeaces;
      });
    }
  };

  if (isOver.length === 9) {
    console.log("done");
  }

  return (
    <section className="game-bg-dark w-full h-screen pt-13 ">
      <div className="px-3 gsap-cards max-w-[480px] mx-auto">
        <DndContext onDragEnd={handleDragEnd}>
          <div className="gsap-place grid grid-cols-3 grid-rows-3 ">
            {PLACES.map((place) => (
              <Map
                ref={(el) => (activeRef.current[place.id] = el)}
                key={place.id}
                place={place}
                images={images}
              />
            ))}
          </div>

          <div className="mt-8 grid grid-cols-3 grid-rows-auto gap-0.5 ">
            {mapPeaces
              .filter((peace) => peace.status === "ready")
              .map((peace) => {
                if (peace.isTrue !== false) {
                  return (
                    <Peaces key={peace.id} images={images} peace={peace} />
                  );
                }
              })}
          </div>
        </DndContext>
      </div>
      {isOver.length === 9 && (
        <>
          <h2 className="bg-amber-50/40 p-4  text-center text-cyan-950 text-[1.3rem] font-extrabold">
            Szuper ügyes vagy 😊! Megtaláltad az aranytojás rejtekhelyét!!!
          </h2>
        </>
      )}
    </section>
  );
};

export default Puzzle;