export const loadExcelJS = async () => {
  if (window.ExcelJS) return window.ExcelJS;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js';
    script.onload = () => resolve(window.ExcelJS);
    script.onerror = () => reject(new Error('Failed to load ExcelJS'));
    document.head.appendChild(script);
  });
};

// Keep old xlsx export for RTM report
const loadXLSX = async () => {
  if (window.XLSX) return window.XLSX;
  try {
    const module = await import('xlsx');
    return module.default || module;
  } catch {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.min.js';
      script.onload = () => resolve(window.XLSX);
      script.onerror = () => reject(new Error('Failed to load XLSX'));
      document.head.appendChild(script);
    });
  }
};

export { loadXLSX };

export const exportToExcel = async (data, filename = "export.xlsx") => {
  const XLSX = await loadXLSX();
  if (!XLSX?.utils) throw new Error("XLSX library failed to load");
  const ws = XLSX.utils.json_to_sheet(data);
  const colWidths = data.length > 0
    ? Object.keys(data[0]).map(key => ({ wch: Math.max(15, key.length + 2) }))
    : [];
  ws['!cols'] = colWidths;
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, filename);
};

export default exportToExcel;
