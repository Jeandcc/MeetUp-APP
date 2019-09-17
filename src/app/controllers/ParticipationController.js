import isBefore from 'date-fns/isBefore';
import Meetup from '../models/Meetup';
import UserMeeting from '../models/UserMeetings';

class ParticipationController {
  async register(req, res) {
    const meetingId = req.params.mid;
    const meeting = await Meetup.findByPk(meetingId);

    const alreadyRegistered = await UserMeeting.findOne({
      where: {
        userId: req.userId,
        meetingId: req.params.mid,
      },
    });

    const pastEvent = isBefore(new Date(), meeting.date_and_time);

    if (!pastEvent) {
      return res
        .status(400)
        .json({ error: "It isn't possible to register for past events" });
    }

    if (alreadyRegistered) {
      return res
        .status(400)
        .json({ error: "You're already registered to this meeting" });
    }

    if (meeting.organizer === req.userId) {
      return res
        .status(400)
        .json({ error: "You can't register for events organized by you" });
    }

    await UserMeeting.create({
      userId: req.userId,
      meetingId: req.params.mid,
    }).then(createdMeeting => {
      return res.status(200).json({
        message: 'You are now registered to this meeting',
        info: createdMeeting,
      });
    });

    return res.status(200).json({ message: 'Meeting successfully created' });
  }

  async index(req, res) {
    const registeredMeetings = await UserMeeting.findAll({
      where: {
        userId: req.userId,
      },
      /* include: [
        {
          model: Meetup,
          as: 'meetings',
          required: false,
          // Pass in the Product attributes that you want to retrieve
          attributes: ['id', 'name'],
        },
      ], */
    });

    return res.status(200).json({ meetings: registeredMeetings });
  }
}

export default new ParticipationController();
