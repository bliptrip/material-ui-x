import {
  GridCellParams,
  gridCheckboxSelectionColDef,
  GridColumns,
  GridRowId,
  GridRowModel,
} from '../../../../models';
import { GridExportCsvDelimiter } from '../../../../models/gridExport';

const serialiseCellValue = (value: any, delimiterCharacter: GridExportCsvDelimiter) => {
  if (typeof value === 'string') {
    const formattedValue = value.replace(/"/g, '""');
    return formattedValue.includes(delimiterCharacter) ? `"${formattedValue}"` : formattedValue;
  }

  return value;
};

export function serialiseRow(
  id: GridRowId,
  columns: GridColumns,
  getCellParams: (id: GridRowId, field: string) => GridCellParams,
  delimiterCharacter: GridExportCsvDelimiter,
): Array<string> {
  const mappedRow: string[] = [];
  columns.forEach(
    (column) =>
      column.field !== gridCheckboxSelectionColDef.field &&
      mappedRow.push(
        serialiseCellValue(getCellParams(id, column.field).formattedValue, delimiterCharacter),
      ),
  );
  return mappedRow;
}

interface BuildCSVOptions {
  columns: GridColumns;
  rows: Map<GridRowId, GridRowModel>;
  selectedRows?: Record<string, GridRowId>;
  getCellParams: (id: GridRowId, field: string) => GridCellParams;
  delimiterCharacter: GridExportCsvDelimiter;
  includeHeaders?: boolean;
}

export function buildCSV(options: BuildCSVOptions): string {
  const {
    columns,
    rows,
    selectedRows,
    getCellParams,
    delimiterCharacter,
    includeHeaders = true,
  } = options;
  let rowIds = [...rows.keys()];

  if (selectedRows) {
    const selectedRowIds = Object.keys(selectedRows);
    if (selectedRowIds.length) {
      rowIds = rowIds.filter((id) => selectedRowIds.includes(`${id}`));
    }
  }

  const CSVBody = rowIds
    .reduce<string>(
      (acc, id) =>
        `${acc}${serialiseRow(id, columns, getCellParams, delimiterCharacter).join(
          delimiterCharacter,
        )}\r\n`,
      '',
    )
    .trim();

  if (!includeHeaders) {
    return CSVBody;
  }

  const CSVHead = `${columns
    .filter((column) => column.field !== gridCheckboxSelectionColDef.field)
    .map((column) => serialiseCellValue(column.headerName || column.field, delimiterCharacter))
    .join(delimiterCharacter)}\r\n`;

  return `${CSVHead}${CSVBody}`.trim();
}
