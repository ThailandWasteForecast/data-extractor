import regions from '../data/regions.json';
import provinces from '../data/provinces.json';
import districts from '../data/districts.json';
import municipalLevels from '../data/municipalLevels.json';
import municipalSizes from '../data/municipalSizes.json';

const SHEET_NAME = 'Name&Size';
const START_ROW = 46;
const BANGKOK_REO_NUMBER = 'กทม';

const definedRegionCode = regions.reduce((lookup, region) => ({
  ...lookup,
  [region.GEO_NAME]: `0${region.GEO_ID}`,
}), {});

const definedProvinceCode = provinces.reduce((lookup, province) => ({
  ...lookup,
  [province.PROVINCE_NAME]: province.PROVINCE_CODE,
}), {});

const definedDistrictCode = districts.reduce((lookup, district) => ({
  ...lookup,
  [district.DISTRICT_NAME]: district.DISTRICT_CODE,
}), {});

const definedLevelType = municipalLevels.reduce((lookup, level) => ({
  ...lookup,
  [level.LEVEL_NAME]: level.LEVEL_TYPE,
}), {});

const definedSizeType = municipalSizes.reduce((lookup, size) => ({
  ...lookup,
  [size.SISE_NAME]: size.SISE_TYPE,
}), {});

const entityType = {
  reo: 'reo',
  region: 'region',
  province: 'province',
  district: 'district',
  municipal: 'municipal',
};

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
  sizeSqkm: 'sizeSqkm',
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
  column: 'U',
  field: fieldNames.municipalFlagSize,
}, {
  column: 'W',
  field: fieldNames.sizeSqkm,
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

function extractEntities(dataRow) {
  const reo = dataRow.reoNumber && {
    type: entityType.reo,
    id: dataRow.reoNumber,
    number: dataRow.reoNumber === BANGKOK_REO_NUMBER ? 0 : dataRow.reoNumber,
    name: dataRow.reoNumber,
  };

  const region = dataRow.regionName && {
    type: entityType.region,
    id: definedRegionCode[dataRow.regionName],
    name: dataRow.regionName,
  };

  const province = dataRow.provinceName && {
    type: entityType.province,
    id: definedProvinceCode[dataRow.provinceName],
    name: dataRow.provinceName,
    regionId: region && region.id,
    sizeSsqkm: dataRow.sizeSqkm && Number(dataRow.sizeSqkm),
  };

  const district = dataRow.districtName && {
    type: entityType.district,
    id: definedDistrictCode[dataRow.districtName],
    name: dataRow.districtName,
    provinceId: province && province.id,
    regionId: region && region.id,
  };

  const municipal = dataRow.municipalNumber && {
    type: entityType.municipal,
    id: [
      (region && region.id) || '00',
      (province && province.id) || '00',
      (district && district.id) || '00',
      (`${dataRow.municipalNumber}`.padStart(4, '0')),
    ].join(''),
    name: dataRow.municipalName,
    number: dataRow.municipalNumber,
    reoId: reo && reo.id,
    regionId: region && region.id,
    provinceId: province && province.id,
    districtId: district && district.id,
    levelType: definedLevelType[dataRow.municipalLevel] || null,
    sizeType: definedSizeType[dataRow.municipalSizeType] || null,
    sizeSqkm: dataRow.sizeSqkm,
    remarkFlags: [
      dataRow.municipalFlagAddition || '0',
      dataRow.municipalFlagAsterisk || '0',
      dataRow.municipalFlagSize || '0',
    ].join(''),
  };

  return [reo, region, province, district, municipal].filter((entity) => !!entity);
}

function extractAllEntities(dataRows) {
  return dataRows.reduce((entities, dataRow) => [
    ...entities,
    ...extractEntities(dataRow),
  ], []);
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

export function convertToSql(dataRows) {
  const dataEntities = extractAllEntities(dataRows);
  console.log(dataEntities);

  return null;
}
