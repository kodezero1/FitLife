import React, { useState } from "react";

type Props = {
  numItems: number;
  itemHeight: number;
  windowHeight: number;
  renderItem: ({ index, style }: { index: number; style: React.CSSProperties }) => JSX.Element;
  overscan?: number;
};

const VirtualList = (props: Props) => {
  const { numItems, itemHeight, renderItem, windowHeight, overscan = 3 } = props;
  const [scrollTop, setScrollTop] = useState(0);

  const innerHeight = numItems * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    numItems - 1, // don't render past the end of the list
    Math.floor((scrollTop + windowHeight) / itemHeight) + overscan
  );

  const items: JSX.Element[] = [];

  for (let i = startIndex; i <= endIndex; i++) {
    items.push(
      renderItem({
        index: i,
        style: { position: "absolute", top: `${i * itemHeight}px`, width: "100%" },
      })
    );
  }

  const onScroll = ({ currentTarget }) => setScrollTop(currentTarget.scrollTop);

  return (
    <div className="scroll" style={{ overflowY: "scroll", width: "100%" }} onScroll={onScroll}>
      <div className="inner" style={{ position: "relative", height: `${innerHeight}px` }}>
        {items}
      </div>
    </div>
  );
};

export default VirtualList;
