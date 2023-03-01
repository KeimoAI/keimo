'use client';

import {
  forwardRef,
  ForwardedRef,
  useRef,
  RefObject,
  useEffect,
  useCallback,
  useState,
  useLayoutEffect,
} from 'react';

const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T | undefined>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export type ScrollEdge = 'top' | 'bottom' | 'mid';

export type Props = {
  text: string;
  className?: string;
  onOverflow?: (isOverflow: boolean) => void;
  onScrollEdge?: (edge: ScrollEdge) => void;
};

const TextScroller = ({ text, className, onOverflow, onScrollEdge }: Props) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const [scrollEdge, setScrollEdge] = useState<ScrollEdge>();
  const [isOverflow, setIsOverflow] = useState<boolean>();
  const prevScrollEdge = usePrevious(scrollEdge);
  const wasOverflow = usePrevious(isOverflow);

  const updateOverflow = useCallback(() => {
    if (ref.current === null) return;

    // Are we overflowing?

    const isOverflow = ref.current.scrollHeight > ref.current.clientHeight;
    setIsOverflow(isOverflow);
    if (onOverflow) onOverflow(isOverflow);

    // What is the scroll position?

    let scrollEdge: ScrollEdge = 'mid' as const;
    if (ref.current.scrollTop === 0) {
      scrollEdge = 'top' as const;
    } else if (
      ref.current.scrollTop >=
      ref.current.scrollHeight - ref.current.clientHeight
    ) {
      scrollEdge = 'bottom' as const;
    }
    setScrollEdge(scrollEdge);
    if (onScrollEdge) onScrollEdge(scrollEdge);
  }, [ref, onOverflow, onScrollEdge]);

  // Update on text change
  useEffect(() => {
    updateOverflow();
  }, [text, updateOverflow]);

  // Keep scrolled to bottom when new text appears
  useLayoutEffect(() => {
    if (
      ((!wasOverflow && isOverflow) ||
        (prevScrollEdge === 'bottom' && scrollEdge !== 'bottom')) &&
      ref.current
    ) {
      ref.current.scrollTop =
        ref.current.scrollHeight - ref.current.clientHeight;
    }
  }, [wasOverflow, isOverflow, scrollEdge, ref]);

  return (
    <p
      className={`overflow-y-auto ${className}`}
      onScroll={updateOverflow}
      ref={ref}
    >
      {text}
    </p>
  );
};

export default TextScroller;
