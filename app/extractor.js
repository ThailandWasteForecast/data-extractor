import minimist from 'minimist';
import xlsx from 'xlsx';
import logger from './logger';
import extractCoreData from './extractorCoreData';

function dispatch(workbook, dataType) {
  switch (dataType) {
    case 'core': return extractCoreData(workbook);
    // case 'pop': return extractPopData(workbook);
    default: return null;
  }
}

function app() {
  const argv = minimist(process.argv.slice(2));

  if (!argv.input || !argv.output || !argv.data) {
    logger.info('Usage: extract --data=[core|pop] --input=path/to/input.xlsx --output=path/to/output.csv');

    return;
  }

  const workbook = xlsx.readFile(argv.input);
  dispatch(workbook, argv.data);
}

export default app;
