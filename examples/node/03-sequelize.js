/* @flow */

class Sequelize {
  define() {
    return {
      findAll: () => { }
    }
  }
}

const SequelizeSchema = {
  STRING: 'STRING',
  DATE: 'DATE',
}

const sequelize = new Sequelize('database', 'username', 'password');

// FIRST TIME
const User = sequelize.define('user', {
  username: SequelizeSchema.STRING,
  birthday: SequelizeSchema.DATE
});

// SECOND TIME
type UserT = {
  username: string;
  birthday: Date;
}

async function getUsersFromDB() {
  const users: ?Array<UserT> = await User.findAll();
  const userLogin = users[0].login;
}
