import express from 'express';
import mongooseConnection from './src/db/mongoose-connection.js';
import accountsRoutes from './src/routes/accountsRoutes.js';

const app = express();
mongooseConnection();

app.use(accountsRoutes);

app.listen(3333, () => {
  console.log('🌟 My bank API has started, port: 3333');
});
