import { tv } from "@nextui-org/react";

export const StyledBurgerButton = tv({
  base: "flex flex-col justify-between transparent w-6 h-5 border-none cursor-pointer padding-0 z-[202] focus:outline-none",
  variants: {
    open: {
      true: "[&",
    },
  },
});