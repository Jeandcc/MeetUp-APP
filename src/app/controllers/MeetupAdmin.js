import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  async index(req, res) {
    await Meetup.findAll({
      where: {
        organizer_id: req.userId,
      },
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['name', 'email'],
        },
      ],
    })
      .then(meetings => {
        if (meetings.length > 0) return res.status(200).json(meetings);
        return res.status(400).json({
          error: 'No meetings found.',
        });
      })
      .catch(err => {
        return res.json({ error: `There was an error: ${err}` });
      });
  }
}

export default new MeetupController();
