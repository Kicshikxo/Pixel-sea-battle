import { getRequestURL, H3Event } from 'h3'
import { createTransport } from 'nodemailer'
import { prisma } from '~~/prisma/client'
import emailConfirmationTemplate from './templates/emailConfirmation'
import passwordRecoveryTemplate from './templates/passwordRecovery'

const transporter = createTransport(
  {
    host: useRuntimeConfig().email.host,
    port: useRuntimeConfig().email.port,
    secure: useRuntimeConfig().email.port === 465,
    auth: {
      user: useRuntimeConfig().email.auth.user,
      pass: useRuntimeConfig().email.auth.password,
    },
  },
  {
    from: useRuntimeConfig().email.from,
  },
)

function renderTemplate(html: string, values: { callback: string }) {
  return Object.entries(values).reduce(
    (html, [key, value]) => html.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value),
    html,
  )
}

export async function sendEmailConfirmation(event: H3Event, email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email },
    include: { emailConfirmation: true },
  })

  if (!user || !user.email) return

  try {
    if (user.emailConfirmation) {
      await prisma.emailConfirmation.delete({ where: { userId: user.id } })
    }
    const emailConfirmation = await prisma.emailConfirmation.create({ data: { userId: user.id } })

    await transporter.sendMail({
      to: user.email,
      subject: 'Подтвердите адрес электронной почты',
      html: renderTemplate(emailConfirmationTemplate, {
        callback: `${getRequestURL(event).origin}/email-confirmation/${emailConfirmation.id}`,
      }),
    })
  } catch (error) {
    console.error(error)
  }
}

export async function sendPasswordRecovery(event: H3Event, email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email },
    include: { passwordRecovery: true },
  })

  if (!user || !user.email) return

  try {
    if (user.passwordRecovery) {
      await prisma.passwordRecovery.delete({ where: { userId: user.id } })
    }
    const passwordRecovery = await prisma.passwordRecovery.create({
      data: { userId: user.id, expiredAt: new Date(Date.now() + 60 * 60 * 1000) },
    })

    await transporter.sendMail({
      to: user.email,
      subject: 'Восстановление пароля',
      html: renderTemplate(passwordRecoveryTemplate, {
        callback: `${getRequestURL(event).origin}/password-recovery/${passwordRecovery.id}`,
      }),
    })
  } catch (error) {
    console.error(error)
  }
}
