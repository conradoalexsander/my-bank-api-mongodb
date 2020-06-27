import express from 'express';
import accountModel from '../models/account.js';

const accountsRouter = express();

accountsRouter.get('/account', async (req, res) => {
  try {
    const accounts = await accountModel.find();
    res.send(accounts);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

accountsRouter.put('/account/deposit', async (req, res) => {
  try {
    const { agencia, conta, value } = req.body;

    const account = await accountModel.findOneAndUpdate(
      { conta, agencia },
      { $inc: { balance: value } },
      {
        new: true,
      }
    );

    if (!account) {
      res
        .status(404)
        .send({ error: 'No account could be found with this criteria' });
    }

    console.log(account);

    res.send(account);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

accountsRouter.put('/account/withdraw', async (req, res) => {
  try {
    const { agencia, conta, value } = req.body;
    const tax = 1;

    let account = await accountModel.findOne({ conta, agencia });

    if (!account) {
      res
        .status(404)
        .send({ error: 'No account could be found with this criteria' });
    }

    if (account.balance < value + tax) {
      res.status(400).send({ error: 'Not enough balance for this operation' });
    }
    account.balance -= value + tax;
    account.save();
    res.send(account);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

accountsRouter.get('/account/show', async (req, res) => {
  try {
    const { conta, agencia } = req.body;
    const account = await accountModel.findOne({ conta, agencia });
    if (!account) {
      res
        .status(404)
        .send({ error: 'No account could be found with this criteria' });
    }

    const { balance } = account;
    res.send({ agencia, conta, balance });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

accountsRouter.delete('/account/destroy', async (req, res) => {
  try {
    const { conta, agencia } = req.body;

    const account = await accountModel.findOneAndDelete({ conta, agencia });

    if (!account) {
      res
        .status(404)
        .send({ error: 'No account could be found with this criteria' });
    }

    const accounts = await accountModel.find({ agencia });

    res.send({ active_accounts: accounts.length });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default accountsRouter;
