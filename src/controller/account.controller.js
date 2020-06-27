import accountModel from '../models/account.js';

const accountController = (() => {
  const deposit = async (agencia, conta, value) => {
    const account = await accountModel.findOneAndUpdate(
      { conta, agencia },
      { $inc: { balance: value } },
      {
        new: true,
      }
    );

    return account;
  };

  const withdraw = async (agencia, conta, value) => {
    const tax = 1;
    let account = await accountModel.findOne({ conta, agencia });

    if (!account) {
      return null;
    }

    if (account.balance < value + tax) {
      throw new Error('Not enough balance for this operation');
    }
    account.balance -= value + tax;
    account.save();
    return account;
  };

  const show = async (conta, agencia) => {
    const account = await accountModel.findOne({ conta, agencia });
    return account;
  };

  // const destroy = async (conta, agencia) => {
  //   const account = await accountModel.findOneAndDelete({ conta, agencia });

  //   if (!account || account == null) {
  //     return null;
  //   }

  //   return account;
  // };

  const listActiveAccountsInAgency = async (agencia) => {
    const accounts = await accountModel.find({ agencia });
    return accounts;
  };

  return {
    deposit,
    withdraw,
    show,
    //destroy,
    listActiveAccountsInAgency,
  };
})();

export default accountController;
