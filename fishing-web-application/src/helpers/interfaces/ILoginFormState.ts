import { SVGProps } from "react";

interface CredentialLoginFormState {
    errors?: {
      email?: string[];
      password?: string[];
      code?: string[];
      _form?: string[];
      twoFactor?: boolean;
      status?:string,
      subtitle?:string,
      description?: string,
    },
}

export default CredentialLoginFormState