const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  config: { imageUrl: { type: String, default: 'assets/profile/profile1.jpg' } },
  friends: [{ type: Schema.Types.ObjectId, default: [], ref: 'user' }],
  chats: [{ default: [], type: Schema.Types.ObjectId, ref: 'chat' }],
});

module.exports = Mongoose.model('user', userSchema);
