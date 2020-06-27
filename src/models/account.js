import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  agencia: Number,
  conta: {
    type: Number,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    min: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Cannot insert negative values for grades');
      }
    },
  },
  name: String,
});

mongoose.model('account', accountSchema, 'account');

const accountModel = mongoose.model('account');

export default accountModel;
