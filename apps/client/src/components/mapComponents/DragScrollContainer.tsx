import {
  Children,
  cloneElement,
  CSSProperties,
  ReactNode,
  useRef,
  useState,
} from 'react';

const DragScrollContainer = ({
  draggable,
  className,
  children,
  style,
}: {
  draggable: boolean;
  className: string;
  children: ReactNode;
  style: CSSProperties;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDown, setIsDown] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [scroll, setScroll] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (!draggable) {
      return;
    }
    if (e.target.closest('.token')) return;

    setIsDown(true);
    if (containerRef.current) {
      setStart({
        x: e.pageX - containerRef.current.offsetLeft,
        y: e.pageY - containerRef.current.offsetTop,
      });
      setScroll({
        x: containerRef.current.scrollLeft,
        y: containerRef.current.scrollTop,
      });
    }
  };

  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);

  const handleMouseMove = (e) => {
    if (!draggable || !isDown) {
      return;
    }
    e.preventDefault();
    if (containerRef.current) {
      const x = e.pageX - containerRef.current.offsetLeft;
      const y = e.pageY - containerRef.current.offsetTop;

      const walk = { x: (x - start.x) * 1, y: (y - start.y) * 1 }; // scroll speed
      containerRef.current.scrollLeft = scroll.x - walk.x;
      containerRef.current.scrollTop = scroll.y - walk.y;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${className} ${draggable ? (isDown ? 'cursor-grabbing' : 'cursor-grab') : 'pointer-events-none'} select-none overflow-x-auto overflow-y-auto whitespace-nowrap`}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={style}
    >
      {Children.map(children, (child) =>
        cloneElement(child, { isdown: isDown.toString() }),
      )}
    </div>
  );
};

export default DragScrollContainer;
