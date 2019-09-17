import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        location: Sequelize.STRING,
        date_and_time: Sequelize.DATE,
        organizer: Sequelize.INTEGER,
        banner_path: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Meetup;
