export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "PRODUCTION" ? true : false,
};
