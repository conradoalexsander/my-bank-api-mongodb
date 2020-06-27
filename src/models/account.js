import mongoose from 'mongoose';

const accountSchema = mongoose.Schema({
  agencia: {
    type: Number,
    required: true,
  },
  conta: {
    type: String,
    default: 10000,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
    required: true,
    validate(value) {
      if (value < 0) {
        throw new Error('Cannot insert negative values for grades');
      }
    },
  },
});

mongoose.model('account', accountSchema, 'account');

const accountModel = mongoose.model('account');

export default accountModel;
