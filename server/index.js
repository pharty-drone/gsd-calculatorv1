import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import gsdRouter from './routes/gsd.js';
import pdfRouter from './routes/pdf.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authToken } from './middleware/authToken.js';

dotenv.config({ path: '../.env' });

const app = express();

app.use(helmet());

const allowedOrigins = ['http://localhost:5173'];
if (process.env.PROD_ORIGIN) {
  allowedOrigins.push(process.env.PROD_ORIGIN);
}
app.use(cors({ origin: allowedOrigins }));

app.use(express.json({ limit: '200kb' }));

app.use('/api', authToken);
app.use('/api/gsd', gsdRouter);
app.use('/api/pdf', pdfRouter);
app.use(errorHandler);

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
