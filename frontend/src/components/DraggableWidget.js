import React from "react";
import { useDrag } from "react-dnd";

const DraggableWidget = ({ widget }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "WIDGET",
    item: { widgetName: widget.name },
    collect: (monitor) => {
      return {
        isDragging: !!monitor.isDragging(),
      };
    },
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        padding: "8px",
        border: "1px solid gray",
        marginBottom: "4px",
        backgroundColor: "white",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: "gray",
          marginRight: "8px",
        }}
      ></div>
      <span style={{ color: "gray" }}>{widget.name}</span>
    </div>
  );
};

export default DraggableWidget;