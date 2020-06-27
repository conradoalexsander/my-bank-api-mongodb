import mongoose from 'mongoose';
import connectionString from './connection-strings.js';

const mongooseConnection = async () => {
  try {
    await mongoose
      .connect(connectionString.MongoDB_Atlas, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log('Conectado ao MongoDB Atlas'))
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
};

export default mongooseConnection;
