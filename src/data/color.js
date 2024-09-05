export const color = {
  green: {
    circleOne: {
      fill: "rgba(22, 163, 74, 0.06)", // Background color of the outer circle
      stroke: "rgba(22, 163, 74, 0.06)", // Border color of the outer circle
      strokeWidth: 0, // Border width of the outer circle
      shadowOffsetX: -3, // Adjust shadow offset
      shadowOffsetY: 6, // Adjust shadow offset
      shadowBlur: 34, // Adjust shadow blur
      shadowColor: "rgba(22, 163, 74, 0.06)",
    },
    circleTwo: {
      fillRadialGradientStartPoint: { x: 0, y: 0 },
      fillRadialGradientEndPoint: { x: 0, y: 0 },
      fillRadialGradientColorStops: [
        0,
        "rgba(255,255,255,0)",
        0.8,
        "rgba(0, 255, 0, 0.1)",
        1,
        "rgba(0, 255, 0, 0.3)",
      ],
    },
  },
  red: {
    circleOne: {
      fill: "rgba(22, 163, 74, 0.06)", // Background color of the outer circle
      stroke: "rgba(220, 38, 38, 0.7)", // Border color of the outer circle
      strokeWidth: 0.8, // Border width of the outer circle
      shadowOffsetX: -3, // Adjust shadow offset
      shadowOffsetY: 6, // Adjust shadow offset
      shadowBlur: 34, // Adjust shadow blur
      shadowColor: "rgba(220, 38, 38, 0.7)",
    },
    circleTwo: {
      fillRadialGradientStartPoint: { x: 0, y: 0 },
      fillRadialGradientEndPoint: { x: 0, y: 0 },
      fillRadialGradientColorStops: [
        0,
        "rgba(255,255,255,0)",
        0.8,
        "rgba(220, 38, 38, 0.1)", // Red color stop at 0.8
        1,
        "rgba(220, 38, 38, 0.3)", // Red color stop at 1
      ],
    },
  },
  white: {
    circleOne: {
      fill: "rgba(255, 255, 255, 0.06)", // Background color of the outer circle
      stroke: "rgba(255, 255, 255, 0.1)", // Border color of the outer circle
      strokeWidth: 0.78, // Border width of the outer circle
    },
    circleTwo: {
      fillRadialGradientStartPoint: { x: 0, y: 0 },
      fillRadialGradientEndPoint: { x: 0, y: 0 },
      fillRadialGradientColorStops: [
        0,
        "rgba(255,255,255,0)",
        0.8,
        "rgba(255, 255, 255, 0.1)",
        1,
        "rgba(255, 255, 255, 0.3)",
      ],
    },
  },
  yellow: {
    circleOne: {
      fill: "rgba(255, 223, 0, 0.06)", // Background color of the outer circle
      stroke: "rgba(255, 223, 0, 0.06)", // Border color of the outer circle
      strokeWidth: 0, // Border width of the outer circle
      shadowOffsetX: -3, // Adjust shadow offset
      shadowOffsetY: 6, // Adjust shadow offset
      shadowBlur: 34, // Adjust shadow blur
      shadowColor: "rgba(255, 223, 0, 0.06)",
    },
    circleTwo: {
      fillRadialGradientStartPoint: { x: 0, y: 0 },
      fillRadialGradientEndPoint: { x: 0, y: 0 },
      fillRadialGradientColorStops: [
        0,
        "rgba(255,255,255,0)",
        0.8,
        "rgba(255, 255, 0, 0.1)", // Light yellow color stop
        1,
        "rgba(255, 255, 0, 0.3)", // More intense yellow color stop
      ],
    },
  },
  cyan: {
    circleOne: {
      fill: "rgba(0, 255, 255, 0.06)", // Background color of the outer circle
      stroke: "rgba(0, 255, 255, 0.06)", // Border color of the outer circle
      strokeWidth: 0, // Border width of the outer circle
      shadowOffsetX: -3, // Adjust shadow offset
      shadowOffsetY: 6, // Adjust shadow offset
      shadowBlur: 34, // Adjust shadow blur
      shadowColor: "rgba(0, 255, 255, 0.06)",
    },
    circleTwo: {
      fillRadialGradientStartPoint: { x: 0, y: 0 },
      fillRadialGradientEndPoint: { x: 0, y: 0 },
      fillRadialGradientColorStops: [
        0,
        "rgba(255,255,255,0)",
        0.8,
        "rgba(0, 255, 255, 0.1)", // Light cyan color stop
        1,
        "rgba(0, 255, 255, 0.3)", // More intense cyan color stop
      ],
    },
  },
};
