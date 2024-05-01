import React from "react";
import type { SVGProps } from "react";

export function BaitIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M256 96c0-53 43-96 96-96h38.4C439.9 0 480 40.1 480 89.6V376c0 75.1-60.9 136-136 136s-136-60.9-136-136v-80c0-22.1-17.9-40-40-40s-40 17.9-40 40v168c0 26.5-21.5 48-48 48s-48-21.5-48-48V296c0-75.1 60.9-136 136-136s136 60.9 136 136v80c0 22.1 17.9 40 40 40s40-17.9 40-40V192h-32c-53 0-96-43-96-96m144-8a24 24 0 1 0-48 0a24 24 0 1 0 48 0"
      ></path>
    </svg>
  );
}
