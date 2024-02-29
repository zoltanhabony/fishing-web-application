import React from "react";
import type { SVGProps } from "react";

export function TwoFactorIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16H3l3.47-4.66A2 2 0 1 0 3 9.8m7 6.2V8h4m-4 4h3m4 4v-6a2 2 0 0 1 4 0v6m-4-3h4"
      ></path>
    </svg>
  );
}
