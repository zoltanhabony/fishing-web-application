import React from "react";
import type { SVGProps } from "react";

export function TokenIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M9.1 9.25q.55-.575 1.288-.913T12 8q.875 0 1.613.338t1.287.912l5.05-2.825l-6.975-3.875q-.45-.275-.975-.275t-.975.275L4.05 6.425zm1.9 12.2v-5.575q-1.3-.35-2.15-1.412T8 12q0-.275.025-.525t.1-.475L3 8.125v7.7q0 .55.275 1.013t.75.737zM12 14q.825 0 1.413-.587T14 12q0-.825-.587-1.412T12 10q-.825 0-1.412.588T10 12q0 .825.588 1.413T12 14m1 7.45l6.975-3.875q.475-.275.75-.737T21 15.824v-7.7L15.875 11q.075.25.1.488T16 12q0 1.4-.85 2.463T13 15.875z"
      ></path>
    </svg>
  );
}
