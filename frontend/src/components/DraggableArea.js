import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { Box } from "@mui/material";
import Widget from "./Widget.js";
import WidgetConfigModal from "./WidgetConfigModal.js";
import axios from "axios";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

const DraggableArea = ({ widgets, dashboardId }) => {
  const [selectedWidgets, setSelectedWidgets] = useState([]);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "WIDGET",
    drop: (item) => {
      handleDrop(item.widgetName);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleDrop = async (widgetName) => {
    let widgetsArray = [];
    try {
      const widget = await axios.get("http://localhost:3001/widgets");
      widgetsArray = widget.data;
    } catch (error) {
      console.error("Error fetching widgets:", error);
    }
    const widget = widgetsArray.find((widget) => widget.name === widgetName);
    if (widget) {
      setSelectedWidget(widget);
      setIsModalOpen(true);
    }
  };

  const handleConfigSave = async (config) => {
    try {
      await axios.post(
        `http://localhost:3001/dashboard/${dashboardId}/widgets`,
        {
          widgetId: config.id,
        }
      );
      const { defaultWidth, defaultHeight } = getWidgetSize(config);

      setSelectedWidgets((prevWidgets) => [
        ...prevWidgets,
        { ...config, defaultWidth, defaultHeight },
      ]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving widget config: ", error);
    }
  };

  const getWidgetSize = (widget) => {
    const WidgetComponent = require(`./widgets/${widget.name.replace(
      /\s+/g,
      ""
    )}Widget.js`).default;
    const defaultWidth = WidgetComponent.defaultWidth || 300;
    const defaultHeight = WidgetComponent.defaultHeight || 300;
    console.log("got: ", [defaultWidth, defaultHeight]);
    return { defaultWidth, defaultHeight };
  };

  return (
    <Box
      ref={drop}
      sx={{
        width: "100%",
        height: "100%",
        border: "2px dotted gray",
        position: "relative",
        backgroundColor: isOver ? "lightgray" : "white",
      }}
    >
      {selectedWidgets.map((widget, index) => (
        <ResizableBox
          key={widget.id}
          width={widget.defaultWidth || 300}
          height={widget.defaultHeight || 300}
          minConstraints={[150, 150]}
          maxConstraints={[600, 600]}
          resizesHandles={["se"]}
          style={{
            position: "absolute",
            top: `${index * 310}px`,
            left: "10px",
          }}
        >
          <Widget config={widget} />
        </ResizableBox>
      ))}
      <WidgetConfigModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleConfigSave}
        widget={selectedWidget}
      />
    </Box>
  );
};

export default DraggableArea;
