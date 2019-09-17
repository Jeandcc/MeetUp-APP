import * as Yup from 'yup';
import { parseISO, isBefore } from 'date-fns';

import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date_and_time: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body)) || !req.file) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { date_and_time } = req.body;
    const parsedDate = parseISO(date_and_time);
    if (!(await isBefore(new Date(), parsedDate))) {
      return res
        .status(400)
        .json({ error: "It isn't possible to create event for past dates" });
    }

    await Meetup.create({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      date_and_time: req.body.date_and_time,
      organizer: req.userId,
      banner_path: req.file.filename,
    });

    return res.status(200).json({ message: 'Meetup successfully created' });
  }

  async update(req, res) {
    await Meetup.findByPk(req.body.meetup_id).then(meetup => {
      if (!meetup) {
        res
          .status(400)
          .json({ error: "The specified meeting couldn't be found" });
      }
      Meetup.update(req.body, {
        where: {
          id: req.body.meetup_id,
        },
      })
        .then(() => {
          res.status(200).json({ message: 'Meetup successfully updated' });
        })
        .catch(() => {});
    });
  }

  async index(req, res) {
    await Meetup.findAll({
      where: {
        organizer: req.userId,
      },
    }).then(meetings => {
      if (meetings.length > 0) res.status(200).json(meetings);
      else res.status(400).json({ error: "You don't have any meetings" });
    });
  }

  async delete(req, res) {
    await Meetup.findByPk(req.params.meetingdId).then(meeting => {
      if (meeting) {
        if (meeting.organizer !== req.userId) {
          res.status(400).json({
            error: "You don't have permission to delete this meeting",
          });
        } else {
          Meetup.destroy({
            where: {
              id: meeting.id,
            },
          }).then(() => {
            res.status(200).json({ message: 'Meeting successfully deleted' });
          });
        }
      } else res.status(400).json({ error: "We couldn't find that meeting" });
    });
  }

  async fetchMe(req, res) {
    Meetup.findAll({}).then(result => {
      res.send(result);
    });
  }
}

export default new MeetupController();
