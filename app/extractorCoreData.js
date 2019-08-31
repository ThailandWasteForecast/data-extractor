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

const columnLookup = columnMaps.reduce((lookup, cm) => ({
  ...lookup,
  [cm.field]: cm.column,
}), {});

function isRowDataEmpty(rowData) {
  return Object.keys(rowData).every((key) => rowData[key] === null);
}

function extractColumnData(sheet, row, col) {
  const data = sheet[`${col}${row}`];
  return data ? data.h : null;
}

function extractRowData(sheet, row) {
  return columnMaps.reduce((obj, cm) => ({
    ...obj,
    [cm.field]: extractColumnData(sheet, row, cm.column) || null,
  }), {});
}

function extractAllRows(sheet, startRow) {
  let row = startRow;
  const rowDataList = [];
  const forever = true;

  while (forever) {
    const rowData = extractRowData(sheet, row);
    if (isRowDataEmpty(rowData)) {
      return rowDataList;
    }

    rowDataList.push(rowData);
    row += 1;
  }

  return rowDataList;
}

function extractCoreData(workbook) {
  const sheet = workbook.Sheets[SHEET_NAME];
  const dataRows = extractAllRows(sheet, START_ROW);

  console.log(dataRows);

  return null;
}

export default extractCoreData;
