import React from "react";
import type { SVGProps } from "react";

export function PieceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="currentColor"
        d="M11.993 2.853a.75.75 0 0 0-1.485-.212l-.337 2.36H6.686l.306-2.145a.75.75 0 1 0-1.484-.212L5.17 5H3.75a.75.75 0 0 0-.001 1.5h1.207l-.428 3H2.75a.75.75 0 1 0 0 1.5h1.565l-.306 2.144a.75.75 0 1 0 1.485.212L5.83 11h3.485l-.306 2.144a.75.75 0 1 0 1.485.212L10.831 11h1.419a.75.75 0 0 0 0-1.5h-1.206l.428-3l1.778.001a.75.75 0 0 0 0-1.5h-1.564zM9.957 6.501L9.529 9.5H6.044l.428-3z"
      ></path>
    </svg>
  );
}
