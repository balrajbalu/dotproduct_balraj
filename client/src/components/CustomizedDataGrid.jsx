import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export default function CustomizedDataGrid({
  rows = [],
  columns = [],
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading,
  totalRows,
}) {
  return (
    <DataGrid
      // checkboxSelection
      rows={rows}
      columns={columns}
      getRowId={(row) => row._id}
      rowCount={totalRows}
      loading={loading}
      paginationMode="server"
      paginationModel={{ page: page - 1, pageSize }}
      onPaginationModelChange={({ page: newPage, pageSize: newPageSize }) => {
        if (newPage + 1 !== page) onPageChange(newPage + 1);
        if (newPageSize !== pageSize) {
          onPageSizeChange(newPageSize);
          onPageChange(1); 
        }
      }}
      pageSizeOptions={[10, 20, 50]}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      disableColumnResize
      density="compact"
    />
  );
}

