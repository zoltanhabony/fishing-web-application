import mailjet from 'node-mailjet';

const mailjetClient = mailjet.apiConnect(process.env.MAILJET_API_PUBLIC_KEY as string, process.env.MAILJET_API_PRIVATE_KEY as string)

export const sendTwoFactorTokenEmail = async ( email: string, token: string) => {
    const emailData = {
        Messages: [
          {
            From: {
              Email: "zoltanhabony@gmail.com",
            },
            To: [
              {
                Email: email,
              },
            ],
            Subject: `2FA Code`,
            TextPart: `<p>Your 2FA code: ${token}</p>`,
          },
        ],
      };

      try {
        const result = await mailjetClient.post('send', { version: 'v3.1' }).request(emailData);
        return result;
      } catch (error) {
        throw error;
      }
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password?token=${token}`;
    
    const emailData = {
        Messages: [
          {
            From: {
              Email: "zoltanhabony@gmail.com",
            },
            To: [
              {
                Email: email,
              },
            ],
            Subject: `Reset your password`,
            TextPart: `<p>Click <a href="${resetLink}">here</a> to reset password</p>`,
          },
        ],
      };

      try {
        const result = await mailjetClient.post('send', { version: 'v3.1' }).request(emailData);
  
      } catch (error) {
        throw error;
      }
};


export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${process.env.NEXT_PUBLIC_API_URL}/auth/email-verification?token=${token}`;
    const emailData = {
        Messages: [
          {
            From: {
              Email: "zoltanhabony@gmail.com",
            },
            To: [
              {
                Email: email,
              },
            ],
            Subject: `Confrim your emai`,
            TextPart: `<p>Click <a href="${confirmLink}">here</a> to confirm email</p>`,
          },
        ],
      };

      try {
        const result = await mailjetClient.post('send', { version: 'v3.1' }).request(emailData);
        return result;
      } catch (error) {
        throw error;
      }
  };
	