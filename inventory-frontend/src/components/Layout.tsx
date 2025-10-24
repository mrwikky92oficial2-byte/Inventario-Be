import { AppBar, Box, Container, CssBaseline, Toolbar, Typography, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Inventario
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button color="inherit" component={RouterLink} to="/">Dashboard</Button>
            <Button color="inherit" component={RouterLink} to="/locations">Ubicaciones</Button>
            <Button color="inherit" component={RouterLink} to="/products">Artículos</Button>
            <Button color="inherit" component={RouterLink} to="/inventory">Inventario</Button>
            <Button color="inherit" component={RouterLink} to="/transfers">Transferencias</Button>
            <Button color="inherit" component={RouterLink} to="/purchase-orders">Órdenes</Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3, flexGrow: 1 }}>{children}</Container>
      <Box component="footer" sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="caption">© {new Date().getFullYear()} Inventario</Typography>
      </Box>
    </Box>
  );
}
