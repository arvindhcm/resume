import { useEffect, useState } from "react";

export const COMPACT_BREAKPOINT = 720;

export function useIsCompact(elementRef) {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setIsCompact(entry.contentRect.width < COMPACT_BREAKPOINT),
    );
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [elementRef]);

  return isCompact;
}
