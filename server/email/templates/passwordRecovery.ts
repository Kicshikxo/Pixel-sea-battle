export default /*html*/ `
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <title>Восстановление пароля</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f2f6fc;
        font-family: sans-serif;
        color: #0d1117;
        -webkit-text-size-adjust: none;
      }
      a {
        color: #2196f3;
        text-decoration: none;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 2px 8px #0001;
        overflow: hidden;
      }
      .header {
        background-color: #e4ecf7;
        padding: 32px 20px;
        text-align: center;
      }
      .header h1 {
        font-size: 24px;
        margin: 0;
        color: #0d1117;
      }
      .content {
        padding: 32px 24px;
        text-align: center;
      }
      .content p {
        font-size: 16px;
        line-height: 1.6;
        color: #555;
        margin-bottom: 24px;
      }
      .button {
        display: inline-block;
        background-color: #2196f3;
        color: #ffffff !important;
        font-size: 16px;
        font-weight: 600;
        padding: 14px 28px;
        border-radius: 6px;
        text-decoration: none;
        transition: background-color 0.2s ease-in-out;
      }
      .button:hover {
        background-color: #1e88e5;
      }
      .footer {
        background-color: #f5f8fc;
        padding: 20px 24px;
        text-align: center;
        font-size: 13px;
        color: #777;
      }
      .link {
        display: inline-block;
        margin-top: 10px;
        word-break: break-all;
        font-size: 14px;
      }
      @media (prefers-color-scheme: dark) {
        body {
          background-color: #0f141a;
          color: #fff;
        }
        .email-container {
          background-color: #1b222a;
          box-shadow: 0 2px 8px #0005;
        }
        .header {
          background-color: #252f3a;
        }
        .header h1 {
          color: #ccc;
        }
        .content p {
          color: #ccc;
        }
        .footer {
          background-color: #1e2630;
          color: #999;
        }
      }
    </style>
  </head>

  <body>
    <div class="email-container">
      <div class="header">
        <h1>Восстановление пароля</h1>
      </div>

      <div class="content">
        <p>Вы запросили сброс пароля для своего аккаунта.</p>
        <p>Нажмите кнопку ниже, чтобы задать новый пароль:</p>

        <a href="{{ callback }}" class="button" target="_blank" rel="noopener noreferrer">
          Сбросить пароль
        </a>

        <p>Если кнопка не работает, используйте ссылку ниже:</p>
        <a href="{{ callback }}" class="link" target="_blank" rel="noopener noreferrer">{{ callback }}</a>

        <p style="margin-top: 24px; font-size: 13px; color: #999;">
          Ссылка действительна в течение 1 часа. Если вы не запрашивали восстановление пароля просто проигнорируйте это письмо.
        </p>
      </div>

      <div class="footer">
        Это письмо отправлено автоматически. Пожалуйста, не отвечайте на него.
      </div>
    </div>
  </body>
</html>
`
