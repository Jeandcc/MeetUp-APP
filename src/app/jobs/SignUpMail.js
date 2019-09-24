import Mail from '../../lib/Mail';

class SignUpMail {
  get key() {
    return 'SignUpMail';
  }

  async handle({ data }) {
    const { organizer, meeting, infoOnUser } = data;
    console.log('Queue was executed');

    await Mail.sendMail({
      to: `${organizer.name} <${organizer.email}>`,
      subject: `New registration to ${meeting.title}`,
      template: 'registration',
      context: {
        organizer,
        meeting,
        infoOnUser,
      },
    });
  }
}

export default new SignUpMail();
