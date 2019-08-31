const SHEET_NAME = 'Name&Size';
const START_ROW = 46;

const fieldNames = {
  reoNumber: 'reoNumber',
  regionName: 'regionName',
  provinceName: 'provinceName',
  districtName: 'districtName',
  municipalNumber: 'municipalNumber',
  municipalLevel: 'municipalLevel',
  municipalName: 'municipalName',
  municipalSizeType: 'municipalSizeType',
  municipalFlagAddition: 'municipalFlagAddition',
  municipalFlagAsterisk: 'municipalFlagAsterisk',
  municipalFlagSize: 'municipalFlagSize',
  municipalSizeSqkm: 'municipalSizeSqkm',
};

const columnMaps = [{
  column: 'B',
  field: fieldNames.reoNumber,
}, {
  column: 'C',
  field: fieldNames.regionName,
}, {
  column: 'D',
  field: fieldNames.provinceName,
}, {
  column: 'E',
  field: fieldNames.districtName,
}, {
  column: 'F',
  field: fieldNames.municipalNumber,
}, {
  column: 'G',
  field: fieldNames.municipalLevel,
}, {
  column: 'H',
  field: fieldNames.municipalName,
}, {
  column: 'I',
  field: fieldNames.municipalSizeType,
}, {
  column: 'S',
  field: fieldNames.municipalFlagAddition,
}, {
  column: 'T',
  field: fieldNames.municipalFlagAsterisk,
}, {
  column: 'T',
  field: fieldNames.municipalFlagSize,
}, {
  column: 'W',
  field: fieldNames.municipalSizeSqkm,
}];

function isRowDataEmpty(rowData) {
  return Object.keys(rowData).every((key) => rowData[key] === null);
}

function extractColumnData(sheet, row, col) {
  const data = sheet[`${col}${row}`];
  return data ? data.v : null;
}

function extractRowData(sheet, row) {
  return columnMaps.reduce((obj, cm) => ({
    ...obj,
    [cm.field]: extractColumnData(sheet, row, cm.column) || null,
  }), {});
}

function extractAllRows(sheet, startRow) {
  const dataRows = [];
  const forever = true;

  while (forever) {
    const row = startRow + dataRows.length;
    const rowData = extractRowData(sheet, row);
    if (isRowDataEmpty(rowData)) {
      return dataRows;
    }

    dataRows.push(rowData);
  }

  return dataRows;
}

export function extractCoreData(workbook) {
  const sheet = workbook.Sheets[SHEET_NAME];
  return extractAllRows(sheet, START_ROW);
}

export function convertToCsv(dataRows) {
  return [
    columnMaps.map((cm) => cm.field).join(', '),
    ...dataRows.map((dataRow) => columnMaps.map((cm) => dataRow[cm.field]).join(', ')),
  ].join('\r\n');
}
