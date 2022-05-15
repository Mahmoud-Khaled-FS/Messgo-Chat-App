const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const chatScheam = new Schema({
  usersId: [{ type: Schema.Types.ObjectId, required: true, ref: 'user' }],
  messages: [
    {
      userId: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
      messageType: { type: String, required: true },
      messageContnet: { type: String, required: true },
      date: { type: Date, required: true },
      messageId: { type: String },
    },
    { default: [] },
  ],
  // text: String,
});
// module.exports = Mongoose.model('chat', chatScheam);
module.exports = Mongoose.model('chat', chatScheam);
