# Project MAP - Setup

- Rename file name `.env.sample` to `.env`
- Setup `.env` file
  - `PORT` (Optional - Change)
  - `CORS_ORIGIN` (Optional - Change)
  - Set `FRONTEND_URL` as your frontend host
  - `MONGODB_DATABASE_URI` & `MONGODB_DATABASE_NAME`(Optional - Change) - Find in [Mongo DB Atlas](https://cloud.mongodb.com/) or user local mongodb uri with port
  - `ACCOUNT_ACCESS_TOKEN_SECRET` - Set Keys [Can use this - `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` in the terminal for using in Registration & Activation]
  - `ACCOUNT_ACCESS_TOKEN_SECRET` - Set Keys [Can use this - `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` in the terminal for using in Login]
  - `ACCOUNT_ACCESS_TOKEN_EXPIRY` - Set Expiry day [like `30d`]
  - Set all SMTP env variables - `SMTP_HOST`, `SMTP_PORT`, `SMTP_HOST`, `SMTP_SERVICE`, `SMTP_HOST`, `SMTP_MAIL`, `SMTP_PASSWORD` for sending mail during registration
- In the terminal `npm init`
- In the terminal `npm run dev` to live the project
