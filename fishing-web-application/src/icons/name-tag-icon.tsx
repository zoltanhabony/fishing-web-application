import React from "react";
import type { SVGProps } from "react";

export function NameTagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        fill="currentColor"
        d="M5 6a4 4 0 1 1 6.646 3h-.133c-.803 0-1.519.377-1.979.965A4 4 0 0 1 5 6m4.053 5H4.009A2.001 2.001 0 0 0 2 13c0 1.691.833 2.966 2.135 3.797C5.417 17.614 7.145 18 9 18c.803 0 1.583-.072 2.313-.22l-1.594-1.627a2.518 2.518 0 0 1-.72-1.762v-2.875c0-.177.02-.35.054-.516M10 14.39c0 .397.155.777.432 1.06l3.034 3.097c.58.592 1.527.606 2.124.031l2.947-2.837a1.514 1.514 0 0 0 .025-2.155l-3.107-3.139A1.509 1.509 0 0 0 14.383 10H11.51A1.51 1.51 0 0 0 10 11.512zm2.75-.89a.75.75 0 1 1 0-1.5a.75.75 0 0 1 0 1.5"
      ></path>
    </svg>
  );
}
