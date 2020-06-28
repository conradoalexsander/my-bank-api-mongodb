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

  const withdraw = async (agencia, conta, value, tax) => {
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

  const doTransferAccounts = async (originAccount, destinyAccount, value) => {
    const payer = await accountModel.findOne({ conta: originAccount });
    const receiver = await accountModel.findOne({ conta: destinyAccount });

    if (!payer || !receiver) {
      return null;
    }

    let {
      conta: payerAccount,
      agencia: payerAgency,
      balance: payerBalance,
    } = payer;

    let {
      conta: receiverAccount,
      agencia: receiverAgency,
      balance: receiverBalance,
    } = receiver;

    const tax = 8;

    if (payer.agencia == receiver.agencia) {
      const withdrawedPayer = await withdraw(
        payerAgency,
        payerAccount,
        value,
        0
      );
      deposit(receiverAgency, receiverAccount, value);

      const { conta, agencia, balance } = withdrawedPayer;

      return { conta, agencia, balance };
    } else if (payer.agencia !== receiver.agencia) {
      const withdrawedPayer = await withdraw(
        payerAgency,
        payerAccount,
        value,
        tax
      );
      deposit(receiverAgency, receiverAccount, value);

      const { conta, agencia, balance } = withdrawedPayer;

      return { conta, agencia, balance };
    } else {
      return null;
    }
  };

  const averageBalanceInAgency = async (agencia) => {
    const accountsInAgency = await accountModel.find({ agencia });

    if (accountsInAgency.length <= 0) {
      return null;
    }

    const average =
      accountsInAgency.reduce((acc, account) => {
        console.log(account);
        return acc + account.balance;
      }, 0) / accountsInAgency.length;

    return { agencia: agencia, saldo_medio: average.toFixed(2) };
  };

  const lowestBalances = async (quantity) => {
    let accounts = await accountModel
      .find({}, null, { sort: { balance: 1 } })
      .limit(quantity);

    if (accounts.length <= 0) {
      return null;
    }
    return accounts;
  };

  const highestBalances = async (quantity) => {
    let accounts = await accountModel
      .find({}, null, { sort: { balance: -1 } })
      .limit(quantity);

    if (accounts.length <= 0) {
      return null;
    }
    return accounts;
  };

  // const transferToPrivate = async () => {
  //   let accounts = await accountModel.aggregate([
  //     { $match: { agencia: '$agencia' } },
  //   ]);
  // };

  return {
    deposit,
    withdraw,
    show,
    //destroy,
    listActiveAccountsInAgency,
    doTransferAccounts,
    averageBalanceInAgency,
    lowestBalances,
    highestBalances,
  };
})();

export default accountController;
