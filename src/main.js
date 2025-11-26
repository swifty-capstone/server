import express from 'express';
import cors from 'cors';
import routes from './routes/routes.js';
import HttpException from './exception/HttpException.js';
import { errorResponse, successResponse } from './utils/response.js';
import { swaggerUi, specs } from './swagger/swagger.js';
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(routes);

app.get('/', (_, res) => {
    return successResponse(res, 200, { health: 'ok' }, 'Server is healthy');
});

app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  console.error('Error stack:', err.stack);
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  
  if (err && err.name === 'UnauthorizedError') {
    return errorResponse(res, 401, 'Missing authorization credentials');
  } 
  
  if (err instanceof HttpException) {
    return errorResponse(res, err.statusCode, err.message);
  } 
  
  return errorResponse(res, 500, 'Internal server error');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});