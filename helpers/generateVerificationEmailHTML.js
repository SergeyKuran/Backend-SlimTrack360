export const generateVerificationEmailHTML = (verificationToken, BASE_URL) => `
  <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .verification-link {
          display: block;
          padding: 10px;
          margin: 20px 0;
          background-color: #4CAF50;
          color: white;
          text-align: center;
          text-decoration: none;
          font-size: 16px;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Verify Your Email</h2>
        <p>Click the following link to verify your email address:</p>
        <a target="_blank" class="verification-link" href="https://maksymbora.github.io/team-project-SlimTrack360/verify/?${verificationToken}">Verify Email</a>
        <p>If you did not sign up for our service, you can safely ignore this email.</p>
      </div>
    </body>
  </html>
`;
