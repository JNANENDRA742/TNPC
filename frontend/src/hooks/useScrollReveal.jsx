import { useState , useEffect, useRef } from "react";

export const useScrollReveal = ()=>{
    const ref = useRef();

    useEffect(()=>{
        const observer = new IntersectionObserver(
            ([entry])=>
            {
                if(entry.isIntersecting){
                    entry.target.classList.add("opacity-100", "translate-y-0");
                }
            },
            {threshold: 0.2}
        );
         if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
    },[])
    return ref;
}