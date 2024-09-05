import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Dot,
  Label,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <p>{`Date: ${formatDateTime(label)}`}</p>
        <p>{`Value: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

function formatDateTime(isoString) {
  const date = new Date(isoString);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return date.toLocaleString("en-US", options);
}

const Example = ({ data }) => {
  const [hoveredValue, setHoveredValue] = useState(null);

  const handleMouseHover = (data) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      setHoveredValue(data.activePayload[0].payload);
    }
  };

  // Calculate the min and max values in the data
  const minValue = Math.min(...data.map((d) => d.value));
  const maxValue = Math.max(...data.map((d) => d.value));

  // Find the points with the lowest and highest values
  const minPoint = data.find((d) => d.value === minValue);
  const maxPoint = data.find((d) => d.value === maxValue);

  let isMinFound = false;
  let isMaxFound = false;

  // Function to render dots conditionally
  const renderCustomDot = (props) => {
    const { cx, cy, value, payload } = props;
    if (payload?.date === minPoint?.date && !isMinFound) {
      isMinFound = true;
      return (
        <>
          <Dot cx={cx} cy={cy} r={5} fill="red" stroke="none" />
          <Label value={value} position="top" fill="red" />
        </>
      );
    }
    if (payload?.date === maxPoint?.date && !isMaxFound) {
      isMaxFound = true;
      return (
        <>
          <Dot cx={cx} cy={cy} r={5} fill="green" stroke="none" />
          <Label value={value} position="top" fill="green" />
        </>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
          onMouseMove={handleMouseHover}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            vertical={false}
          />
          <XAxis dataKey="date" hide />
          <YAxis
            hide
            domain={[
              minValue - (maxValue - minValue) * 0.1,
              maxValue + (maxValue - minValue) * 0.1,
            ]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area dataKey="value" stroke="none" fill="rgb(121, 61, 224)" />
          <Line
            dataKey="value"
            stroke="#8884d8"
            activeDot={false}
            dot={renderCustomDot}
          />
        </ComposedChart>
      </ResponsiveContainer>
      {hoveredValue !== null && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            backgroundColor: "transparent",
            padding: "5px",
            color: "white",
            fontSize: "1.2em",
            fontWeight: "bold",
            display: "flex",
            flexDirection: "column",
            color: "#808080",
          }}
        >
          <p>{formatDateTime(hoveredValue.date)}</p>
        </div>
      )}
    </div>
  );
};

export default Example;
