import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/routes.js';


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());



app.use(router);

app.listen(process.env.SERVER_PORT, () => {
  console.log('Server listening on port 4000.');
});
