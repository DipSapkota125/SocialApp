export const generateOTP = () => {
  const otpLength = 6; // Specify the length of the OTP
  let otp = "";

  for (let i = 0; i < otpLength; i++) {
    otp += Math.floor(Math.random() * 10); // Generate a random digit (0-9) and append it to the OTP
  }

  return otp;
};
