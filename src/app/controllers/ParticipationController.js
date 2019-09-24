import isBefore from 'date-fns/isBefore';
import { isSameHour, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import UserMeetings from '../models/UserMeetings';
import User from '../models/User';

/* import SignUpMail from '../jobs/SignUpMail';
import Queue from '../../lib/Queue'; */
import Mail from '../../lib/Mail';

function makeReadable(object) {
  return JSON.parse(JSON.stringify(object));
}

class ParticipationController {
  async register(req, res) {
    const meetingId = req.params.mid;
    let meeting = await Meetup.findByPk(meetingId).catch(err => {
      return res.status(400).json({ error: `Internal Error: ${err}` });
    });
    if (!meeting) {
      return res
        .status(400)
        .json({ error: "We couldn't find the specified meeting" });
    }

    let infoOnUser = await User.findOne({
      where: {
        id: req.userId,
      },
      include: [
        {
          model: Meetup,
          as: 'meetings',
          required: false,
          // Pass in the User's attributes that you want to retrieve
          attributes: [
            'id',
            'title',
            'date_and_time',
            'organizer_id',
            'banner_path',
          ],
          through: {
            // This block of code allows you to retrieve the properties of the join table
            model: UserMeetings,
            as: 'userMeetings',
            attributes: [],
          },
        },
      ],
      attributes: ['id', 'name'],
    })
      .then()
      .catch(err => {
        console.log(err);
      });

    infoOnUser = makeReadable(infoOnUser);
    meeting = makeReadable(meeting);

    const meetingsOfUser = infoOnUser.meetings;
    let shouldReturn = false;
    meetingsOfUser.forEach(reunion => {
      const isSameTime = isSameHour(
        parseISO(reunion.date_and_time),
        parseISO(meeting.date_and_time)
      );
      if (isSameTime) {
        shouldReturn = true;
      }
    });
    if (shouldReturn) {
      return res.status(400).json({
        error:
          "You're already registered to a meeting that happens at the same time",
      });
    }

    if (meeting.organizer_id === req.userId) {
      return res
        .status(400)
        .json({ error: "You can't register for events organized by you" });
    }

    const futureEvent = isBefore(new Date(), parseISO(meeting.date_and_time));
    if (!futureEvent) {
      return res
        .status(400)
        .json({ error: "It isn't possible to register for past events" });
    }

    const alreadyRegistered = await UserMeetings.findOne({
      where: {
        userId: req.userId,
        meetingId,
      },
    });
    if (alreadyRegistered) {
      return res
        .status(400)
        .json({ error: "You're already registered to this meeting" });
    }

    let organizer = await User.findByPk(meeting.organizer_id);
    organizer = makeReadable(organizer);

    await UserMeetings.create({
      userId: req.userId,
      meetingId,
    }).then(async createdMeeting => {
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
      /*       const payload = 'PLACEHOLDER';
      await Queue.add(SignUpMail.key, {
        payload,
      }); */
      return res.status(200).json({
        message: 'You are now registered to this meeting',
        info: createdMeeting,
      });
    });
    return this;
  }

  async userMeetings(req, res) {
    await User.findOne({
      where: {
        id: req.userId,
      },
      include: [
        {
          model: Meetup,
          where: {
            date_and_time: {
              [Op.gt]: new Date(),
            },
          },
          as: 'meetings',
          required: false,
          // Pass in the User's attributes that you want to retrieve
          attributes: [
            'id',
            'title',
            'date_and_time',
            'organizer_id',
            'banner_path',
          ],
          through: {
            // This block of code allows you to retrieve the properties of the join table
            model: UserMeetings,
            as: 'userMeetings',
          },
        },
      ],
      attributes: ['id', 'name'],
      order: [['meetings', 'date_and_time', 'ASC']],
    })
      .then(result => {
        const meetings = makeReadable(result.meetings);
        if (meetings.length <= 0) {
          return res
            .status(400)
            .json({ error: "You're not registed to any meetings" });
        }
        return res.json(result);
      })
      .catch(err => {
        console.log(err);
      });
  }
}

export default new ParticipationController();
