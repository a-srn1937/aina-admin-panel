import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { EmptyContent } from '../empty-content';
import { LoadingScreen } from '../loading-screen';

// ----------------------------------------------------------------------

export function TableNoData({ isLoading = false, notFound, sx, ...other }) {
  return (
    <TableRow>
      {isLoading ? (
        <TableCell colSpan={12}>
          <LoadingScreen sx={{ py: 20 }} />
        </TableCell>
      ) : notFound ? (
        <TableCell colSpan={12}>
          <EmptyContent filled sx={[{ py: 10 }, ...(Array.isArray(sx) ? sx : [sx])]} {...other} />
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}
