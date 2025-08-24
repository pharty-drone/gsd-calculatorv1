import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

// simple formatting helpers
const num = (value, digits = 2) =>
  Number.parseFloat(value).toFixed(digits);
const pct = (value) => `${Math.round(value)}%`;
const formatLengthUnits = (units) => (units === 'imperial' ? 'ft' : 'm');

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(
    d.getHours()
  )}${pad(d.getMinutes())}`;
}

export async function exportGsdPdf({ inputs, results }) {
  if (!results) {
    return;
  }

  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const margin = 14;

  doc.setFontSize(16);
  doc.text('GSD Calculator Report', margin, 20);
  doc.setFontSize(10);
  doc.text(new Date().toLocaleString(), margin, 28);

  // input parameters
  doc.setFontSize(12);
  doc.text('Input Parameters', margin, 40);
  const inputRows = [
    ['Model', inputs.model],
    [
      'Altitude',
      `${num(inputs.altitude ?? inputs.flightAltitude, 2)} ${formatLengthUnits(
        inputs.units
      )}`,
    ],
    [
      'Roof Height',
      `${num(inputs.roofHeight || 0, 2)} ${formatLengthUnits(inputs.units)}`,
    ],
    ['Sensor Width', `${num(inputs.sensorWidth, 2)} mm`],
    ['Image Width', `${inputs.imageWidth}`],
    ['Image Height', `${inputs.imageHeight}`],
    ['Focal Length', `${num(inputs.focalLength, 2)} mm`],
    ['Units Mode', inputs.units],
    [
      'Desired Overlap',
      `${pct(
        inputs.desiredOverlap?.front ?? results?.overlap?.desired.front
      )} / ${pct(
        inputs.desiredOverlap?.side ?? results?.overlap?.desired.side
      )}`,
    ],
  ];
  autoTable(doc, {
    startY: 44,
    head: [['Parameter', 'Value']],
    body: inputRows,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [66, 66, 66] },
  });

  let y = doc.lastAutoTable.finalY + 8;
  doc.setFontSize(12);
  doc.text('Results', margin, y);
  const resultRows = [
    ['Ground GSD', `${num(results.groundGSD, 2)} ${results.gsdUnit}`],
    ['Roof GSD', `${num(results.roofGSD, 2)} ${results.gsdUnit}`],
    [
      'Footprint',
      `${num(results.footprintWidth, 2)} × ${num(
        results.footprintHeight,
        2
      )} ${results.footprintUnit}`,
    ],
    [
      'Overlap Desired',
      `${pct(results.overlap.desired.front)} / ${pct(
        results.overlap.desired.side
      )}`,
    ],
    [
      'Overlap Actual',
      `${pct(results.overlap.actual.front)} / ${pct(results.overlap.actual.side)}`,
    ],
  ];
  autoTable(doc, {
    startY: y + 4,
    head: [['Metric', 'Value']],
    body: resultRows,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [66, 66, 66] },
  });

  y = doc.lastAutoTable.finalY + 8;
  doc.setFontSize(12);
  doc.text('Recommendation', margin, y);
  doc.setFontSize(10);
  const { altitudeOption, overlapOption } = results.overlap.recommendation || {};
  let recText = '';
  if (altitudeOption) {
    recText += `Altitude: ${num(altitudeOption.flightAltitude, 2)} ${
      altitudeOption.units
    }${altitudeOption.note ? ` - ${altitudeOption.note}` : ''}`;
  }
  if (overlapOption) {
    if (recText) recText += '\n';
    recText += `Overlap: ${pct(overlapOption.front)} / ${pct(
      overlapOption.side
    )} ${
      overlapOption.units
    }${overlapOption.note ? ` - ${overlapOption.note}` : ''}`;
  }
  if (!recText) recText = 'None';
  const lines = doc.splitTextToSize(recText, 180);
  doc.text(lines, margin, y + 6);

  // optional diagram capture
  try {
    const diagram = document.getElementById('results-diagram');
    if (diagram) {
      const canvas = await html2canvas(diagram, { scale: 2 });
      const img = canvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(img);
      const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;
      if (y + 40 + imgHeight > doc.internal.pageSize.getHeight()) {
        doc.addPage();
        y = margin;
      } else {
        y += 40;
      }
      doc.addImage(img, 'PNG', margin, y, pageWidth, imgHeight);
    }
  } catch (err) {
    console.warn('Diagram capture failed', err);
  }

  const filename = `gsd-report-${timestamp()}.pdf`;
  doc.save(filename);
  return filename;
}

export default exportGsdPdf;
