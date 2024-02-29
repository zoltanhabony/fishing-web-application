"use client";

import { googleLogin } from "@/actions";
import { Button } from "@nextui-org/react";

export const Social = () => {
  return (
    <form action={googleLogin} className="w-full">
      <div className="flex items-center w-full gap-x-2">
      <Button color="primary" type="submit" className="w-full ">Continue with Google</Button>
      </div>
    </form>
  );
};
