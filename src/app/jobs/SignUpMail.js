/* import Mail from '../../lib/Mail';

class SignUpMail {
  get key() {
    return 'SignUpMail';
  }

  async handle({ data }) {
    const { registration } = data;

    await Mail.sendMail({
      to: `${user.name}<${user.email}>`,
      subject: `New registration to ${meeting.title}`,
      template: registration,
      context: {
        provider: meeting.provider.name,
        user: meeting.user.name,
      },
    });
  }
}

export default new SignUpMail(); */
