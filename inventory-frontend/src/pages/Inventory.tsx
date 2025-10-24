import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { adjustQuantity } from '../slices/inventorySlice';
import { Box, Typography, TextField, MenuItem, Table, TableHead, TableRow, TableCell, TableBody, Button, Stack } from '@mui/material';

export default function Inventory() {
  const dispatch = useDispatch();
  const products = useSelector((s: RootState) => s.products);
  const locations = useSelector((s: RootState) => s.locations);
  const inventory = useSelector((s: RootState) => s.inventory);

  const [filterLocation, setFilterLocation] = useState<string>('all');

  const rows = useMemo(() => {
    const arr: Array<{
      productId: string;
      productName: string;
      sku: string;
      locationId: string;
      locationName: string;
      quantity: number;
      minQty: number;
      maxQty: number;
    }> = [];

    for (const invId of inventory.allIds) {
      const inv = inventory.byId[invId];
      const p = products.byId[inv.productId];
      const l = locations.byId[inv.locationId];
      if (!p || !l) continue;
      if (filterLocation !== 'all' && l.id !== filterLocation) continue;
      arr.push({
        productId: p.id,
        productName: p.name,
        sku: p.sku,
        locationId: l.id,
        locationName: l.name,
        quantity: inv.quantity,
        minQty: p.minQty,
        maxQty: p.maxQty,
      });
    }

    return arr.sort((a, b) => a.productName.localeCompare(b.productName));
  }, [inventory, products, locations, filterLocation]);

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Inventario
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <TextField
          select
          label="Filtrar por ubicación"
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          sx={{ minWidth: 260 }}
        >
          <MenuItem value="all">Todas</MenuItem>
          {locations.allIds.map((id) => (
            <MenuItem key={id} value={id}>
              {locations.byId[id].name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>SKU</TableCell>
            <TableCell>Producto</TableCell>
            <TableCell>Ubicación</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Mín</TableCell>
            <TableCell>Máx</TableCell>
            <TableCell align="right">Ajustar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={`${r.productId}-${r.locationId}`}>
              <TableCell>{r.sku}</TableCell>
              <TableCell>{r.productName}</TableCell>
              <TableCell>{r.locationName}</TableCell>
              <TableCell>{r.quantity}</TableCell>
              <TableCell>{r.minQty}</TableCell>
              <TableCell>{r.maxQty}</TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button size="small" variant="outlined" onClick={() => dispatch(adjustQuantity({ productId: r.productId, locationId: r.locationId, delta: -1 }))}>-1</Button>
                  <Button size="small" variant="outlined" onClick={() => dispatch(adjustQuantity({ productId: r.productId, locationId: r.locationId, delta: 1 }))}>+1</Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
