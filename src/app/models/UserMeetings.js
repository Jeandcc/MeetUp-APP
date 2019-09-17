import Sequelize, { Model } from 'sequelize';

class UserMeetings extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.UUID,
        meeting_id: Sequelize.UUID,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default UserMeetings;
