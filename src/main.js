import express from 'express';
import cors from 'cors';
import routes from './routes/routes.js';
import HttpException from './utils/http/Exception.js';
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.get('/', (_, res) => {
    res.json({ "health": "ok" });
});

app.use((err, req, res, next) => {
  if (err && err.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: 'error',
      message: 'missing authorization credentials',
    });

  } else if (err instanceof HttpException) {
    res.status(err.errorCode).json({ message: err.message });

  } else if (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});