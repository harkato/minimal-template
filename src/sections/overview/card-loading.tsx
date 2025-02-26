// Utilizado como fallback de loading dos componentes dependentes da API

import { Skeleton, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';

export const SkeletonTools = () => (
  <Stack spacing={1} width="100%">
    <Skeleton variant="rectangular" width="100%" height={72} sx={{ borderRadius: 2 }} />
  </Stack>
);

export const SkeletonTopFive = () => (
  <>
    {[...Array(5)].map((_, index) => (
      <Grid key={index} size={{ xs: 12, sm: 6, md: 2.4 }}>
        <Skeleton variant="rectangular" width="100%" height={180} sx={{ borderRadius: 2 }} />
      </Grid>
    ))}
  </>
);
