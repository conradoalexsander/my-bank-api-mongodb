const PASSWORD = '';
const DB = '';
const CLUSTER = '';

const connectionString = {
  MongoDB_Atlas: `mongodb+srv://fullstacker:${PASSWORD}@${CLUSTER}.gcp.mongodb.net/${DB}?retryWrites=true&w=majority`,
};

export default connectionString;
