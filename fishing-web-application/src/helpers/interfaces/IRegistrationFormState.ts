interface CredentialRegistrationFormState {
    errors: {
      username?: string[];
      email?: string[];
      password?: string[];
      confirmPassword?: string[];
      accountType?: string[]
      _form?: string[];
    },
    success?:{
      _form?: string[]
    },
    warning?:{
      _form?: string[]
    }
    information?:{
      _form?: string[]
    }
}

export default CredentialRegistrationFormState