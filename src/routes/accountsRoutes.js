import express from 'express';
import accountModel from '../models/account.js';

const accountsRouter = express();

accountsRouter.get('/account', async (req, res) => {
  try {
    const accounts = await accountModel.find({});
    res.send(accounts);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default accountsRouter;
