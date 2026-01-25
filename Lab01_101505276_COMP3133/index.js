// index.js
const fs = require('fs');
const csv = require('csv-parser');

const INPUT_FILE = 'input_countries.csv';
const CANADA_FILE = 'canada.txt';
const USA_FILE = 'usa.txt';

// a) Delete canada.txt and usa.txt if they already exist
[CANADA_FILE, USA_FILE].forEach((file) => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`Deleted existing file: ${file}`);
  }
});

// Prepare write streams
const canadaStream = fs.createWriteStream(CANADA_FILE, { flags: 'a' });
const usaStream = fs.createWriteStream(USA_FILE, { flags: 'a' });

let headersWritten = false;

// Read CSV
fs.createReadStream(INPUT_FILE)
  .pipe(csv())
  .on('headers', (headers) => {
    // Convert headers array into CSV header line
    const headerLine = headers.join(',') + '\n';

    // Write headers to both files
    canadaStream.write(headerLine);
    usaStream.write(headerLine);

    headersWritten = true;
  })
  .on('data', (row) => {
    const country =
      row.country || row.Country || row['Country Name'];

    if (!country) return;

    const line = Object.values(row).join(',') + '\n';

    // Write into the correct file
    if (country === 'Canada') {
      canadaStream.write(line);
    }

    if (country === 'United States') {
      usaStream.write(line);
    }
  })
  .on('end', () => {
    console.log('CSV processing complete.');
    canadaStream.end();
    usaStream.end();
  })
  .on('error', (err) => {
    console.error('Error reading CSV:', err);
  });
