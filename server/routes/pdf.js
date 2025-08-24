import { Router } from 'express';
import PDFDocument from 'pdfkit';

const router = Router();

router.post('/', (req, res) => {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  doc.text('GSD Report');
  doc.pipe(res);
  doc.end();
});

export default router;
