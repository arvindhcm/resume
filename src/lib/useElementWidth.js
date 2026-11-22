import { useEffect, useState } from "react";

export function useElementWidth(elementRef) {
  const [width, setWidth] = useState(() =>
    typeof window === "undefined" ? 1024 : window.innerWidth,
  );

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.borderBoxSize[0].inlineSize),
    );
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [elementRef]);

  return width;
}
