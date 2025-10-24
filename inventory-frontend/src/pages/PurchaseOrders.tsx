import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import type { RootState } from '../store';
import { appendPurchaseOrderItem, createPurchaseOrder, updatePurchaseOrderStatus } from '../slices/purchaseOrdersSlice';
import { adjustQuantity } from '../slices/inventorySlice';
import { Box, Typography, TextField, MenuItem, Button, Table, TableHead, TableRow, TableCell, TableBody, Stack, Chip } from '@mui/material';

export default function PurchaseOrders() {
  const dispatch = useDispatch();
  const products = useSelector((s: RootState) => s.products);
  const locations = useSelector((s: RootState) => s.locations);
  const purchaseOrders = useSelector((s: RootState) => s.purchaseOrders);

  const [vendor, setVendor] = useState('');
  const [toLocationId, setToLocationId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitCost, setUnitCost] = useState(0);

  const onCreate = () => {
    if (!vendor.trim() || !toLocationId) return;
    const id = uuid();
    const now = new Date().toISOString();
    dispatch(
      createPurchaseOrder({ id, vendor, toLocationId, items: [], status: 'open', createdAt: now, updatedAt: now })
    );
  };

  const onAddItem = (id: string) => {
    if (!productId || quantity <= 0 || unitCost < 0) return;
    dispatch(appendPurchaseOrderItem({ id, productId, quantity, unitCost }));
  };

  const onReceive = (id: string) => {
    const po = purchaseOrders.byId[id];
    if (!po) return;
    for (const item of po.items) {
      dispatch(adjustQuantity({ productId: item.productId, locationId: po.toLocationId, delta: item.quantity }));
    }
    dispatch(updatePurchaseOrderStatus({ id, status: 'received' }));
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Órdenes de Compra
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <TextField label="Proveedor" value={vendor} onChange={(e) => setVendor(e.target.value)} />
        <TextField select label="Para ubicación" value={toLocationId} onChange={(e) => setToLocationId(e.target.value)} sx={{ minWidth: 200 }}>
          {locations.allIds.map((id) => (
            <MenuItem key={id} value={id}>{locations.byId[id].name}</MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={onCreate}>Crear</Button>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <TextField select label="Producto" value={productId} onChange={(e) => setProductId(e.target.value)} sx={{ minWidth: 200 }}>
          {products.allIds.map((id) => (
            <MenuItem key={id} value={id}>{products.byId[id].name}</MenuItem>
          ))}
        </TextField>
        <TextField type="number" label="Cantidad" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        <TextField type="number" label="Costo unitario" value={unitCost} onChange={(e) => setUnitCost(Number(e.target.value))} />
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Proveedor</TableCell>
            <TableCell>Ubicación</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Items</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {purchaseOrders.allIds.map((id) => {
            const po = purchaseOrders.byId[id];
            return (
              <TableRow key={id}>
                <TableCell>{id.slice(0, 8)}</TableCell>
                <TableCell>{po.vendor}</TableCell>
                <TableCell>{locations.byId[po.toLocationId]?.name ?? '—'}</TableCell>
                <TableCell><Chip label={po.status} size="small" /></TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {po.items.map((it, idx) => (
                      <Chip key={idx} label={`${products.byId[it.productId]?.name ?? '—'} x${it.quantity}`} size="small" />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button size="small" onClick={() => onAddItem(id)}>Agregar ítem</Button>
                    <Button size="small" variant="contained" onClick={() => onReceive(id)} disabled={po.items.length === 0 || po.status === 'received'}>
                      Recibir
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
}
