import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setApiBaseUrl } from '../slices/configSlice';
import { setAllLocations } from '../slices/locationsSlice';
import { setAllProducts } from '../slices/productsSlice';
import { setAllInventory } from '../slices/inventorySlice';
// import { setAllTransfers } from '../slices/transfersSlice';
// import { setAllPurchaseOrders } from '../slices/purchaseOrdersSlice';
import { ApiClient, createClientFromState } from '../api/client';
import { adaptAlmacenToLocation, adaptProductoToProduct, buildInventoryFromEntregas } from '../api/adapters';
import { Box, Typography, TextField, Button, Stack } from '@mui/material';

export default function Settings() {
  const dispatch = useDispatch();
  const apiBaseUrl = useSelector((s: RootState) => s.config.apiBaseUrl);
  const state = useSelector((s: RootState) => s);

  const onSync = async () => {
    const client = createClientFromState(state);
    if (!client) return;
    try {
      // Use VPS endpoints: productos, almacenes, entregas
      const baseClient = new ApiClient({ baseUrl: apiBaseUrl });
      const [rawProductos, rawAlmacenes, rawEntregas] = await Promise.all([
        baseClient.listProductos(),
        baseClient.listAlmacenes(),
        baseClient.listEntregas(),
      ]);
      const products = (rawProductos as any[]).map(adaptProductoToProduct);
      const locations = (rawAlmacenes as any[]).map(adaptAlmacenToLocation);
      const inventory = buildInventoryFromEntregas(rawEntregas as any[]);

      dispatch(setAllProducts(products));
      dispatch(setAllLocations(locations));
      dispatch(setAllInventory(inventory));
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Ajustes de Conexión
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label="API Base URL"
          value={apiBaseUrl}
          onChange={(e) => dispatch(setApiBaseUrl(e.target.value))}
          placeholder="https://tu-vps.tld/api"
        />
        <Button variant="contained" onClick={onSync} disabled={!apiBaseUrl}>
          Sincronizar
        </Button>
      </Stack>
    </Box>
  );
}
