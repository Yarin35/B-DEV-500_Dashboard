import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDrop } from "react-dnd";
import { Box } from "@mui/material";
import Widget from "./Widget.js";
import WidgetConfigModal from "./WidgetConfigModal.js";
import axios from "axios";
import { ResizableBox } from "react-resizable";
import Draggable from "react-draggable";
import "react-resizable/css/styles.css";

const DraggableArea = forwardRef(({ dashboardId }, ref) => {
  const [widgets, setWidgets] = useState([]);
  const [widgetPositions, setWidgetPositions] = useState([]);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropRef = useRef(null);
  const draggableRefs = useRef([]);

  useEffect(() => {
    const fetchDashboardContent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/widgets/${dashboardId}/widgets`
        );
        console.log("Dashboard content:", response.data);
        const widgetsData = Array.isArray(response.data) ? response.data : [];
        const updatedWidgets = widgetsData.map((widget) => {
          const { defaultWidth, defaultHeight } = getWidgetSize(widget);
          return { ...widget, defaultWidth, defaultHeight };
        });
        setWidgets(updatedWidgets);
        setWidgetPositions(
          response.data.map((widget) => ({
            id: widget.widget_id,
            position: widget.position || { left: 0, top: 0 },
            config: widget.config || {},
          }))
        );
      } catch (error) {
        console.error("Error fetching dashboard content:", error);
      }
    };
    fetchDashboardContent();
  }, [dashboardId]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "WIDGET",
    drop: (item, monitor) => {
      handleDrop(item.widgetName, monitor);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  drop(dropRef);

  const handleDrop = async (widgetName, monitor) => {
    const dropPosition = monitor.getClientOffset();
    const dropRect = dropRef.current?.getBoundingClientRect();
    let widgetsArray = [];
    try {
      const widget = await axios.get("http://localhost:3001/widgets");
      widgetsArray = widget.data;
    } catch (error) {
      console.error("Error fetching widgets:", error);
    }
    const widget = widgetsArray.find((widget) => widget.name === widgetName);
    if (widget) {
      const newPosition = {
        left: dropPosition.x - dropRect.left,
        top: dropPosition.y - dropRect.top,
      };

      if (!checkOverlap(widget, newPosition)) {
        setSelectedWidget(widget);
        setIsModalOpen(true);
        setWidgetPositions([
          ...widgetPositions,
          { id: widget.id, position: newPosition },
        ]);
      } else {
        console.error(
          "Cannot place widget here, it overlaps with another widget."
        );
      }
    }
  };

  const checkOverlap = (newWidget, newPosition) => {
    return widgetPositions.some((widget) => {
      const existingWidget = widgets.find((w) => w.id === widget.id);
      const existingPosition = widget.position;
      return (
        newPosition.left <
          existingPosition.left + existingWidget.defaultWidth &&
        newPosition.left + newWidget.defaultWidth > existingPosition.left &&
        newPosition.top < existingPosition.top + existingWidget.defaultHeight &&
        newPosition.top + newWidget.defaultHeight > existingPosition.top
      );
    });
  };

  const handleConfigSave = async (config) => {
    try {
      const position = widgetPositions.find(
        (pos) => pos.id === config.id
      )?.position;
      await axios.post(
        `http://localhost:3001/dashboard/${dashboardId}/widgets`,
        {
          widgetId: config.id,
          position: JSON.stringify(position),
          config: JSON.stringify(config.config),
        }
      );
      const { defaultWidth, defaultHeight } = getWidgetSize(config);

      const newWidget = { ...config, defaultWidth, defaultHeight };
      setWidgets((prevWidgets) => [...prevWidgets, newWidget]);
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

  const saveDashboard = async () => {
    try {
      const widgetsData = widgets.map((widget) => ({
        id: widget.id,
        position: widgetPositions.find((pos) => pos.id === widget.id)?.position,
        config: widget.config,
      }));
      await axios.post(`http://localhost:3001/dashboard/${dashboardId}/save`, {
        widgets: widgetsData,
      });
      console.log("Dashboard content saved successfully");
    } catch (error) {
      console.error("Error saving dashboard content:", error);
    }
  };

  useImperativeHandle(ref, () => ({
    saveDashboard,
  }));

  return (
    <Box
      ref={dropRef}
      sx={{
        width: "100%",
        height: "100%",
        border: "2px dotted gray",
        position: "relative",
        backgroundColor: isOver ? "lightgray" : "white",
      }}
      id="draggable-area"
    >
      {widgets.map((widget, index) => {
        const widgetPosition = widgetPositions.find(
          (pos) => pos.id === widget.widget_id
        );
        const position = widgetPosition ? widgetPosition.position : { left: 0, top: 0 };
        if (!draggableRefs.current[index]) {
          draggableRefs.current[index] = React.createRef();
        }
        return (
          <Draggable
            key={widget.id}
            nodeRef={draggableRefs.current[index]}
            defaultPosition={{ x: position.left, y: position.top }}
            onStop={(e, data) => {
              const newPosition = { left: data.x, top: data.y };
              setWidgetPositions((prevPositions) =>
                prevPositions.map((pos) =>
                  pos.id === widget.widget_id
                    ? { ...pos, position: newPosition }
                    : pos
                )
              );
            }}
          >
            <div ref={draggableRefs.current[index]}>
              <ResizableBox
                width={widget.defaultWidth || 300}
                height={widget.defaultHeight || 300}
                minConstraints={[150, 150]}
                maxConstraints={[600, 600]}
                resizeHandles={["se"]}
                style={{
                  position: "absolute",
                }}
              >
                <Widget config={widget} />
              </ResizableBox>
            </div>
          </Draggable>
        );
      })}
      <WidgetConfigModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleConfigSave}
        widget={selectedWidget}
      />
    </Box>
  );
});

export default DraggableArea;
