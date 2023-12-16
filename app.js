import express, { json } from 'express';
import logger from 'morgan';
import cors from 'cors';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRoutes.js';
import recommendedFoodRouter from './routes/recommendedFood.js';
import foodIntakeRouter from './routes/foodIntakeRouter.js';
const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(json());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/user', foodIntakeRouter);
app.use('/api', recommendedFoodRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Not found!' });
});

app.use((err, _, res, __) => {
  const { status = 500, message = 'Internal Server Error' } = err;

  res.status(status).json({ message });
});

export default app;
