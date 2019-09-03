import minimist from 'minimist';
import xlsx from 'xlsx';
import { promises as fs } from 'fs';

import logger from './logger';
import { extractCoreData, convertToCsv, convertToSql } from './extractCoreData';

function extractByDataType(workbook, dataType) {
  switch (dataType) {
    case 'core': return extractCoreData(workbook);
    default: return null;
  }
}

function convertToCsvByDataType(dataRows, dataType) {
  switch (dataType) {
    case 'core': return convertToCsv(dataRows);
    default: return null;
  }
}

function convertToSqlByDataType(dataRows, dataType) {
  switch (dataType) {
    case 'core': return convertToSql(dataRows);
    default: return null;
  }
}

async function app() {
  const argv = minimist(process.argv.slice(2));

  if (!argv.input || !argv.output || !argv.data) {
    logger.info('Usage: extract --data=[core|pop] --input=path/to/input.xlsx --output=path/to/output');

    return;
  }

  const workbook = xlsx.readFile(argv.input);
  const dataRows = extractByDataType(workbook, argv.data);
  const csv = convertToCsvByDataType(dataRows, argv.data);
  const sql = convertToSqlByDataType(dataRows, argv.data);

  try {
    await fs.writeFile(`${argv.output}/core.csv`, csv);
  } catch (e) {
    logger.error(e);
  }
}

export default app;
