import { H3Event } from 'h3'
import { createTransport } from 'nodemailer'
import { default as getConfirmEmailTemplate } from '~/server/email/templates/confirmEmail'

const transporter = createTransport(
  {
    host: useRuntimeConfig().email.host,
    port: useRuntimeConfig().email.port,
    auth: {
      user: useRuntimeConfig().email.auth.user,
      pass: useRuntimeConfig().email.auth.password,
    },
  },
  {
    from: useRuntimeConfig().email.from,
  },
)

export async function sendVerificationEmail(event: H3Event, email: string) {
  const user = await prisma.user.findUnique({ where: { email: email }, include: { emailConfirmation: true } })

  if (!user) return

  try {
    if (user.emailConfirmation) {
      await prisma.emailConfirmation.delete({ where: { userId: user.id } })
    }
    const emailConfirmation = await prisma.emailConfirmation.create({ data: { userId: user.id } })

    await transporter.sendMail({
      to: user?.email,
      subject: 'Подтвердите адрес электронной почты',
      html: getConfirmEmailTemplate({ callback: `${getRequestURL(event).origin}/confirmEmail?id=${emailConfirmation.id}` }),
    })
  } catch (e) {
    console.error(e)
  }
}
