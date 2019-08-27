function extractCoreData(workbook) {
  const sheet = workbook.Sheets['Name&Size'];
  const f47 = sheet.F47;
  const w47 = sheet.W47;

  console.log(f47, w47);

  return null;
}

export default extractCoreData;
