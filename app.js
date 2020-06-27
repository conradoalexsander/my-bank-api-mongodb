import express from 'express';
import mongooseConnection from './src/db/mongoose-connection.js';
import accountsRoutes from './src/routes/accountsRoutes.js';

mongooseConnection();
const app = express();
app.use(express.json());

app.use(accountsRoutes);

app.listen(3333, () => {
  console.log('🌟 My bank API has started, port: 3333');
});
