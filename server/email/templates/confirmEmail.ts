export default (values: { callback: string }, html: string = template) => {
  return Object.entries(values).reduce(
    (html, [key, value]) => html.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value),
    html,
  )
}

export const template = /*html*/ `
<!DOCTYPE html>
<html>
  <head>
    <title>Confirm your email</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
      body {
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }

      table,
      td {
        border-collapse: collapse;
      }

      img {
        border: 0;
        height: auto;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }

      p {
        margin: 13px 0;
      }

      @media only screen and (min-width: 480px) {
        .mj-column-per-100 {
          width: 100% !important;
        }
      }
    </style>
  </head>

  <body>
    <div>
      <div style="background: #fff; margin: 0 auto; max-width: 600px">
        <table role="presentation" style="background: #fff; width: 100%">
          <tbody>
            <tr>
              <td style="border: #dddddd solid 1px; border-top: 0; direction: ltr; font-size: 0; padding: 20px 0; text-align: center; vertical-align: top">
                <div class="mj-column-per-100" style="font-size: 13px; text-align: left; direction: ltr; display: inline-block; vertical-align: bottom; width: 100%">
                  <table role="presentation" width="100%">
                    <tr>
                      <td align="center" style="padding: 10px 25px; padding-bottom: 40px; word-break: break-word">
                        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 32px; font-weight: bold; line-height: 1; text-align: center; color: #555">Подтвердите адрес электронной почты</div>
                      </td>
                    </tr>

                    <tr>
                      <td align="center" style="padding: 10px 25px; padding-bottom: 20px; word-break: break-word">
                        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 22px; text-align: center; color: #555">Пожалуйста, подтвердите свой адрес электронной почты, чтобы начать пользоваться аккаунтом</div>
                      </td>
                    </tr>

                    <tr>
                      <td align="center" style="padding: 10px 25px; padding-top: 30px; padding-bottom: 40px; word-break: break-word">
                        <a href="{{ callback }}">
                          <table role="presentation" style="border-collapse: separate; line-height: 100%">
                            <tr>
                              <td align="center" bgcolor="#2F67F6" role="presentation" style="border: none; border-radius: 3px; color: #ffffff; cursor: auto; padding: 15px 25px" valign="middle">
                                <p style="background: #2f67f6; color: #ffffff; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 15px; font-weight: normal; line-height: 120%; margin: 0; text-decoration: none; text-transform: none">Подтвердить почту</p>
                              </td>
                            </tr>
                          </table>
                        </a>
                      </td>
                    </tr>

                    <tr>
                      <td align="center" style="padding: 10px 25px; padding-bottom: 0; word-break: break-word">
                        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 22px; text-align: center; color: #555">Или подтвердите с помощью этой ссылки:</div>
                      </td>
                    </tr>

                    <tr>
                      <td align="center" style="padding: 10px 25px; padding-bottom: 40px; word-break: break-word">
                        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 22px; text-align: center; color: #555">
                          <a href="{{ callback }}" style="color: #2f67f6">{{ callback }}</a>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </body>
</html>
`
