import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setApiBaseUrl } from '../slices/configSlice';
import { setAllLocations } from '../slices/locationsSlice';
import { setAllProducts } from '../slices/productsSlice';
import { setAllInventory } from '../slices/inventorySlice';
import { setAllTransfers } from '../slices/transfersSlice';
import { setAllPurchaseOrders } from '../slices/purchaseOrdersSlice';
import { createClientFromState } from '../api/client';
import { Box, Typography, TextField, Button, Stack } from '@mui/material';

export default function Settings() {
  const dispatch = useDispatch();
  const apiBaseUrl = useSelector((s: RootState) => s.config.apiBaseUrl);
  const state = useSelector((s: RootState) => s);

  const onSync = async () => {
    const client = createClientFromState(state);
    if (!client) return;
    try {
      const [locations, products, inventory, transfers, pos] = await Promise.all([
        client.getLocations(),
        client.getProducts(),
        client.getInventory(),
        client.getTransfers(),
        client.getPurchaseOrders(),
      ]);
      dispatch(setAllLocations(locations));
      dispatch(setAllProducts(products));
      dispatch(setAllInventory(inventory));
      dispatch(setAllTransfers(transfers));
      dispatch(setAllPurchaseOrders(pos));
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
