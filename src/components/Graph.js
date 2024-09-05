import React, { useRef, useEffect, useState } from "react";
import { Avatar, Box } from "@mui/material";

const Graph = ({ data, width, height, coinName, coinSymbol, id }) => {
  const canvasRef = useRef(null);
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  let highestPricePoint = { price: -Infinity };
  let lowestPricePoint = { price: Infinity };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear previous drawings
    ctx.clearRect(0, 0, width, height);

    // Draw the axes
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width, height);
    ctx.moveTo(0, height);
    ctx.lineTo(0, 0);
    ctx.stroke();

    // Draw the line graph
    const minY = Math.min(...data.map((item) => item.price));
    const maxY = Math.max(...data.map((item) => item.price));
    const rangeY = maxY - minY;
    const paddingY = rangeY * 0.1; // Add some padding
    const scaledHeight = height - paddingY * 2;
    const stepX = width / (data.length - 1);
    const stepY = scaledHeight / (rangeY + paddingY * 2);

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(25, 89, 193, 0.8)"); // lighter purple-blue with increased transparency
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)"); // black with full transparency

    ctx.beginPath();
    ctx.moveTo(0, height - (data[0]?.price - minY + paddingY) * stepY);
    ctx.fillStyle = gradient;

    data.forEach((item, index) => {
      const x = index * stepX;
      const y = height - (item.price - minY + paddingY) * stepY;
      ctx.lineTo(x, y);

      // Find highest and lowest price points
      if (item.price > highestPricePoint.price) {
        highestPricePoint = { ...item, x, y };
      }
      if (item.price < lowestPricePoint.price) {
        lowestPricePoint = { ...item, x, y };
      }
    });

    ctx.lineTo(width, height);
    ctx.lineTo(0, height); // Add bottom-left corner to the path
    ctx.closePath(); // Close the path

    ctx.fill(); // Fill the area with gradient

    // Draw the line graph again to cover the fill edges
    ctx.beginPath();
    ctx.moveTo(0, height - (data[0]?.price - minY + paddingY) * stepY);

    data.forEach((item, index) => {
      const x = index * stepX;
      const y = height - (item.price - minY + paddingY) * stepY;
      ctx.lineTo(x, y);
    });

    ctx.stroke();

    // Draw highest and lowest price circles with labels
    drawPriceCircle(
      ctx,
      highestPricePoint.x,
      highestPricePoint.y,
      "green",
      highestPricePoint.price,
      true
    );
    drawPriceCircle(
      ctx,
      lowestPricePoint.x,
      lowestPricePoint.y,
      "red",
      lowestPricePoint.price,
      false
    );

    // Draw the hovered dot and price
    if (hoveredInfo) {
      ctx.beginPath();
      ctx.arc(hoveredInfo.x, hoveredInfo.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();

      ctx.fillStyle = "black";
      ctx.fillText(
        `Price: ${hoveredInfo?.price}`,
        hoveredInfo.x,
        hoveredInfo.y - 30
      ); // Adjusted the position here

      // Draw x-axis scale line
      ctx.strokeStyle = "gray";
      ctx.beginPath();
      ctx.moveTo(hoveredInfo.x, hoveredInfo.y);
      ctx.lineTo(hoveredInfo.x, 0); // Top
      ctx.moveTo(hoveredInfo.x, hoveredInfo.y);
      ctx.lineTo(hoveredInfo.x, height); // Bottom
      ctx.stroke();

      // Draw y-axis scale line
      ctx.beginPath();
      ctx.moveTo(hoveredInfo.x, hoveredInfo.y);
      ctx.lineTo(0, hoveredInfo.y); // Left
      ctx.moveTo(hoveredInfo.x, hoveredInfo.y);
      ctx.lineTo(width, hoveredInfo.y); // Right
      ctx.stroke();
    }
  }, [data, width, height, hoveredInfo]);

  // Function to handle mouse movement
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Find closest data point
    const stepX = width / (data.length - 1);
    const minY = Math.min(...data.map((item) => item.price));
    const maxY = Math.max(...data.map((item) => item.price));
    const rangeY = maxY - minY;
    const paddingY = rangeY * 0.1;
    const scaledHeight = height - paddingY * 2;
    const stepY = scaledHeight / (rangeY + paddingY * 2);
    const index = Math.round(mouseX / stepX);
    const closestDataPoint = data[index];

    if (closestDataPoint) {
      setHoveredInfo({
        date: closestDataPoint.date,
        price: closestDataPoint.price,
        x: index * stepX,
        y: height - (closestDataPoint.price - minY + paddingY) * stepY,
      });
      setHoveredDate(closestDataPoint.date);
    } else {
      setHoveredInfo(null);
      setHoveredDate(null);
    }
  };

  // Function to handle mouse leaving the graph
  const handleMouseLeave = () => {
    setHoveredInfo(null);
    setHoveredDate(null);
  };

  // Function to draw a circle representing a price point
  const drawPriceCircle = (ctx, x, y, color, price, isHighest) => {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    const yOffset = isHighest ? -20 : 10;
    ctx.fillText(`$${price.toFixed(3)}`, x + 10, y + yOffset);
  };

  return (
    <div style={{ position: "relative" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          src={id !== null ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png` :""}
          sx={{
            width: 25,
            height: 25,
            mr: 1,
          }}
        />
        <span>
          {coinName !== "" ? coinName : "Coin Name"}&nbsp;
          {coinSymbol !== "" ? coinSymbol : "Coin Symbol"}
        </span>
      </Box>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {hoveredDate && (
        <p style={{ position: "absolute", bottom: 0, left: 10 }}>
          {hoveredDate}
        </p>
      )}
    </div>
  );
};

export default Graph;
