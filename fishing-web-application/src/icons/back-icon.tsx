import React from "react";
import type { SVGProps } from "react";

export function BackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        stroke="#969696"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        <path d="m9 14l-4-4l4-4" ></path>
        <path d="M5 10h11a4 4 0 1 1 0 8h-1"></path>
      </g>
    </svg>
  );
}
