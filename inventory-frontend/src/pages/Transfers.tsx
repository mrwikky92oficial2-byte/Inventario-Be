import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import type { RootState } from '../store';
import { appendTransferItem, createTransfer, updateTransferStatus } from '../slices/transfersSlice';
import { adjustQuantity } from '../slices/inventorySlice';
import { Box, Typography, TextField, MenuItem, Button, Table, TableHead, TableRow, TableCell, TableBody, Stack, Chip } from '@mui/material';

export default function Transfers() {
  const dispatch = useDispatch();
  const products = useSelector((s: RootState) => s.products);
  const locations = useSelector((s: RootState) => s.locations);
  const transfers = useSelector((s: RootState) => s.transfers);

  const [fromLocationId, setFromLocationId] = useState('');
  const [toLocationId, setToLocationId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const onCreateTransfer = () => {
    if (!fromLocationId || !toLocationId || fromLocationId === toLocationId) return;
    const id = uuid();
    const now = new Date().toISOString();
    dispatch(
      createTransfer({
        id,
        fromLocationId,
        toLocationId,
        items: [],
        status: 'requested',
        createdAt: now,
        updatedAt: now,
      })
    );
  };

  const onAddItem = (id: string) => {
    if (!productId || quantity <= 0) return;
    dispatch(appendTransferItem({ id, productId, quantity }));
  };

  const onReceive = (id: string) => {
    const t = transfers.byId[id];
    if (!t) return;
    // decrement from source, increment in target
    for (const item of t.items) {
      dispatch(adjustQuantity({ productId: item.productId, locationId: t.fromLocationId, delta: -item.quantity }));
      dispatch(adjustQuantity({ productId: item.productId, locationId: t.toLocationId, delta: item.quantity }));
    }
    dispatch(updateTransferStatus({ id, status: 'received' }));
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Transferencias
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <TextField select label="Desde" value={fromLocationId} onChange={(e) => setFromLocationId(e.target.value)} sx={{ minWidth: 200 }}>
          {locations.allIds.map((id) => (
            <MenuItem key={id} value={id}>{locations.byId[id].name}</MenuItem>
          ))}
        </TextField>
        <TextField select label="Hacia" value={toLocationId} onChange={(e) => setToLocationId(e.target.value)} sx={{ minWidth: 200 }}>
          {locations.allIds.map((id) => (
            <MenuItem key={id} value={id}>{locations.byId[id].name}</MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={onCreateTransfer}>Crear</Button>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <TextField select label="Producto" value={productId} onChange={(e) => setProductId(e.target.value)} sx={{ minWidth: 200 }}>
          {products.allIds.map((id) => (
            <MenuItem key={id} value={id}>{products.byId[id].name}</MenuItem>
          ))}
        </TextField>
        <TextField type="number" label="Cantidad" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} sx={{ maxWidth: 160 }} />
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Desde</TableCell>
            <TableCell>Hacia</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Items</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transfers.allIds.map((id) => {
            const t = transfers.byId[id];
            return (
              <TableRow key={id}>
                <TableCell>{id.slice(0, 8)}</TableCell>
                <TableCell>{locations.byId[t.fromLocationId]?.name ?? '—'}</TableCell>
                <TableCell>{locations.byId[t.toLocationId]?.name ?? '—'}</TableCell>
                <TableCell><Chip label={t.status} size="small" /></TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {t.items.map((it, idx) => (
                      <Chip key={idx} label={`${products.byId[it.productId]?.name ?? '—'} x${it.quantity}`} size="small" />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button size="small" onClick={() => onAddItem(id)}>Agregar ítem</Button>
                    <Button size="small" variant="contained" onClick={() => onReceive(id)} disabled={t.items.length === 0 || t.status === 'received'}>
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
