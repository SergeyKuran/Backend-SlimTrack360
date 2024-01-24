export const documentSucssesfullVerification = verificationToken => {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
     body {
     font-family: Arial, sans-serif;
     background: azure;
    }

    .container {
     position: absolute;
     top: 50%;
     left: 50%;
     width: 40vw;
     margin: 0 auto;
     padding: 20px;
     background: black;
     color: rgb(182, 182, 182);
     border-radius: 12px;
     border: 1px solid;
     transform: translate(-50%, -50%);
    }

    h1 {
     text-align: center;
     color: green;
    }

    p {
     color: rgb(182, 182, 182);
     font-size: 16px;
     text-align: center;
    }

    a {
      display: block;
      padding: 10px;
      margin: 20px auto;
      width: 20%;
      max-width: 300px;
      background-color: rgb(227, 255, 168);
      color: black;
      text-align: center;
      text-decoration: none;
      font-size: 16px;
      border-radius: 12px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Verification Successful!</h1>
    <p>Your account has been successfully verified. You can now <a target="_blank" href="http://localhost:5173/Frontend-SlimTrack360/verify?searchQuery=${verificationToken}">Sign In</a></p>
  </div>
</body>
</html>`;
};
