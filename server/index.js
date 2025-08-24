import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import gsdRouter from './routes/gsd.js';
import pdfRouter from './routes/pdf.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config({ path: '../.env' });

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/gsd', gsdRouter);
app.use('/api/pdf', pdfRouter);
app.use(errorHandler);

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
