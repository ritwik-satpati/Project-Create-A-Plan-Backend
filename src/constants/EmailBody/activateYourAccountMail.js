export const activateYourAccountMail = (name, link) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Account Activation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f9f9f9;
        padding: 20px;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        border: 1px solid #ddd;
        border-radius: 2px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        color: #555;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
        color: #1d4ed8;
      }
      .content {
        margin-top: 20px;
      }
      .content p {
        margin: 0 0 15px;
      }
      .cta-button {
        display: inline-block;
        margin: 0 0 15px;
        padding: 10px 20px;
        background-color: transparent;
        color: #1d4ed8;
        border: 2px solid #1d4ed8;
        text-decoration: none;
        border-radius: 2px;
        font-size: 16px;
        transition: background-color 0.3s, color 0.3s;
      }
      .cta-button:hover {
        background-color: #1d4ed8; 
        color: #ffffff; 
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>Activate Your Account</h1>
      </div>
      <div class="content">
        <p>Hi <strong>${name}</strong>,</p>
        <p>
          Thank you for signing up! To activate your account, please click the
          button below:
        </p>
        <a
          href="${link}"
          target="_blank"
          class="cta-button"
          >Activate Account</a
        >
        <p>
          If the button above doesn't work, you can also copy and paste the
          following link into your browser:
        </p>
        <p style="word-wrap: break-word; word-break: break-all">
          <a
            href="${link}"
            target="_blank"
            >${link}</a
          >
        </p>
      </div>
      <footer>
        <p style="font-size: 12px; color: #888">
          If you did not request this, please ignore this email.
        </p>
      </footer>
    </div>
  </body>
</html>
`;
};
