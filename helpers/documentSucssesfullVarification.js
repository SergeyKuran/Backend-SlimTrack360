export const documentSucssesfullVerifacation = () => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Верифікація успішна</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 50px;
        }

        h1 {
            color: green;
        }

        p {
            font-size: 18px;
        }
         .verification-signin {
          padding: 2px;
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
    <h1>Верифікація успішна!</h1>
    <p>Ваш обліковий запис було успішно верифіковано. Тепер ви можете <a
    target="_blank"
    class="verification-signin"
    href="https://healthyhub-emsa.onrender.com/api/signin"
  >
    Увійти
  </a></p>
</body>
</html>`;
};
