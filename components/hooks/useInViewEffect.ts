import { useRef, useCallback } from "react";

interface UseInViewEffect {
  (
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
    externalState?: React.ComponentState[]
  ): (node: Element | null) => void;
}

/**
 * useInViewEffect
 * @param callback IntersectionObserverCallback
 * @param options IntersectionObserverInit
 * @param externalState React.ComponentState[]
 */
const useInViewEffect: UseInViewEffect = (
  callback,
  { root, rootMargin, threshold = 0 } = {},
  externalState = []
) => {
  const target = useRef<Element | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const setTarget = useCallback(
    (node) => {
      if (target.current && observer.current) {
        observer.current.unobserve(target.current);
        observer.current.disconnect();
        observer.current = null;
      }

      if (node) {
        observer.current = new IntersectionObserver(
          (entries, observer) =>
            entries[0] &&
            entries[0].isIntersecting &&
            entries[0].intersectionRatio >= threshold &&
            callback(entries, observer),
          { root, rootMargin, threshold }
        );
        observer.current.observe(node);
        target.current = node;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [target, root, rootMargin, threshold, ...externalState]
  );

  return setTarget;
};

export default useInViewEffect;
