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

  const destroy = async (conta, agencia) => {
    const account = await accountModel.findOneAndDelete({ conta, agencia });

    if (!account || account == null) {
      return null;
    }

    return account;
  };

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
    const accountsInAgency = await accountModel.aggregate([
      { $match: { agencia: Number(agencia) } },
      { $group: { _id: '$agencia', media: { $avg: '$balance' } } },
    ]);

    if (accountsInAgency.length <= 0) {
      return null;
    }

    const averageBalance = {
      agencia,
      media: accountsInAgency[0].media.toFixed(2),
    };

    return averageBalance;
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

  const transferToPrivate = async () => {
    let accountsInAgency = await accountModel.aggregate([
      { $sort: { agencia: 1, balance: -1 } },
      {
        $group: {
          _id: '$agencia',
          acc: {
            $first: {
              conta: '$conta',
              agencia: '$agencia',
              balance: '$balance',
            },
          },
        },
      },
    ]);

    if (accountsInAgency.length == 0) {
      return null;
    }

    accountsInAgency.forEach(async (account) => {
      await accountModel.findOneAndUpdate(
        { conta: account.acc.conta, agencia: account.acc.agencia },
        { $set: { agencia: 99 } },
        {
          new: true,
        }
      );
    });

    accountsInAgency = await listActiveAccountsInAgency(99);

    return accountsInAgency;
  };

  return {
    deposit,
    withdraw,
    show,
    destroy,
    listActiveAccountsInAgency,
    doTransferAccounts,
    averageBalanceInAgency,
    lowestBalances,
    highestBalances,
    transferToPrivate,
  };
})();

export default accountController;
