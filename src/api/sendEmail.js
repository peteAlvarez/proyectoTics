export async function enviarCorreo(email) {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer TU_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'onboarding@resend.dev',
      to: email,
      subject: '🚨 ALERTA DE ROBO',
      html: '<strong>Se detectó un posible robo</strong>'
    })
  })
}