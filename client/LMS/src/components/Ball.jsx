import React from "react";

export default function Ball({ className = "" }) {
  return (
    <div className="absolute top-1/3 sm:top-1/2 left-1/3 sm:left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-3 -z-2">
      {/* keyframes directly in the component */}
      <style>
        {`
          @keyframes anime {
            from { translate(-5%,10%) skew(0deg) }
            to { translate(5%,-6%) skew(-10deg) }
          }
          @keyframes anime2 {
            from { transform: translate(-5%,10%) }
            to { transform: translate(5%,-6%) }
          }
        `}
      </style>

      <div
        className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] bg-orange-600 rounded-full blur-[10px]"
        style={{
          animation: "anime2 5s ease-in-out infinite alternate",
        }}
      ></div>

      {/* Second blurred circle */}
      <div
        className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] bg-orange-600 rounded-full blur-[50px]"
        style={{
          animation: "anime 4s ease-in-out infinite alternate",
        }}
      ></div>
    </div>
  );
};

