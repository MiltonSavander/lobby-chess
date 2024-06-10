import { useDragLayer } from "react-dnd";

const CustomDragLayer = ({ boardOffset, containerDimensions }) => {
  const { item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getClientOffset(),
    initialSourceClientOffset: monitor.getInitialSourceClientOffset(),
  }));

  function getItemStyles() {
    if (!currentOffset || !boardOffset) {
      return {
        display: "none",
      };
    }

    const { x: initialX, y: initialY } = boardOffset;
    const { x: currentX, y: currentY } = currentOffset;
    const offsetX = currentX - initialX - containerDimensions.width / 16;
    const offsetY = currentY - initialY - containerDimensions.height / 16;

    return {
      position: "fixed",
      pointerEvents: "none",
      zIndex: 100,
      transform: `translate(${offsetX}px, ${offsetY}px)`,
      width: containerDimensions.width / 8,
      height: containerDimensions.height / 8,
    };
  }

  return (
    <div style={getItemStyles()}>
      <img className="size-full" src={item?.src} alt="" />
    </div>
  );
};

export default CustomDragLayer;
