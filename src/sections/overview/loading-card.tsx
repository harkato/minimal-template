import {
  Card,
  Box,
  CardHeader,
  Skeleton,
  Collapse,
  CardContent,
  Grid,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

const LoadingCard = () => {
  return (
    <Card sx={{ bgcolor: 'white' }}>
      <Box>
        <CardHeader
          title={<Skeleton variant="text" width="80%" height={30} />}
          sx={{
            p: 3,
            bgcolor: 'grey.300',
            padding: '20px',
          }}
          action={
            <>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="circular" width={40} height={40} sx={{ ml: 2 }} />
              <Skeleton variant="circular" width={40} height={40} sx={{ ml: 2 }} />
            </>
          }
        />
      </Box>
      <Collapse in={true} timeout="auto" unmountOnExit>
        <CardContent>
          <Grid container sx={{ justifyContent: 'space-between' }}>
            <Grid>
              <Typography variant="body2">
                <Skeleton variant="text" width={100} />
              </Typography>
              <Typography variant="body2">
                <Skeleton variant="text" width={80} />
              </Typography>
              <Typography variant="body2">
                <Skeleton variant="text" width={120} />
              </Typography>
            </Grid>
            <Grid>
              <Skeleton variant="text" width={80} height={40} />
            </Grid>
          </Grid>
          <Typography variant="h6" style={{ marginTop: '10px', marginBottom: '10px' }}>
            <Skeleton variant="text" width="60%" />
          </Typography>
          <TableContainer
            component={Paper}
            style={{ backgroundColor: 'transparent', borderRadius: '5px' }}
          >
            <Table size="small">
              <TableHead style={{ backgroundColor: 'transparent', borderRadius: '5px' }}>
                <TableRow>
                  <TableCell>
                    <Skeleton variant="text" width={50} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={60} />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(3)].map((_, index) => (
                  <TableRow key={index} style={{ borderBottom: '1px solid #ddd' }}>
                    <TableCell>
                      <Skeleton variant="text" width={50} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={60} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default LoadingCard;
