import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import type { RootState } from '../store';
import { addProduct, removeProduct, setProductActive, updateProduct } from '../slices/productsSlice';
import { Box, Typography, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, Switch, Stack } from '@mui/material';

export default function Products() {
  const dispatch = useDispatch();
  const products = useSelector((s: RootState) => s.products);

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [costPrice, setCostPrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [minQty, setMinQty] = useState<number>(0);
  const [maxQty, setMaxQty] = useState<number>(0);

  const onAdd = () => {
    if (!name.trim() || !sku.trim()) return;
    dispatch(
      addProduct({
        id: uuid(),
        sku,
        name,
        costPrice,
        salePrice,
        minQty,
        maxQty,
        active: true,
      })
    );
    setName('');
    setSku('');
    setCostPrice(0);
    setSalePrice(0);
    setMinQty(0);
    setMaxQty(0);
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Artículos
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <TextField label="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
        <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Precio Compra" type="number" value={costPrice} onChange={(e) => setCostPrice(Number(e.target.value))} />
        <TextField label="Precio Venta" type="number" value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value))} />
        <TextField label="Mínimo" type="number" value={minQty} onChange={(e) => setMinQty(Number(e.target.value))} />
        <TextField label="Máximo" type="number" value={maxQty} onChange={(e) => setMaxQty(Number(e.target.value))} />
        <Button variant="contained" onClick={onAdd}>Agregar</Button>
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>SKU</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Compra</TableCell>
            <TableCell>Venta</TableCell>
            <TableCell>Mín</TableCell>
            <TableCell>Máx</TableCell>
            <TableCell>Activo</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.allIds.map((id) => {
            const p = products.byId[id];
            return (
              <TableRow key={id}>
                <TableCell>
                  <TextField variant="standard" value={p.sku} onChange={(e) => dispatch(updateProduct({ ...p, sku: e.target.value }))} />
                </TableCell>
                <TableCell>
                  <TextField variant="standard" value={p.name} onChange={(e) => dispatch(updateProduct({ ...p, name: e.target.value }))} />
                </TableCell>
                <TableCell>
                  <TextField type="number" variant="standard" value={p.costPrice} onChange={(e) => dispatch(updateProduct({ ...p, costPrice: Number(e.target.value) }))} />
                </TableCell>
                <TableCell>
                  <TextField type="number" variant="standard" value={p.salePrice} onChange={(e) => dispatch(updateProduct({ ...p, salePrice: Number(e.target.value) }))} />
                </TableCell>
                <TableCell>
                  <TextField type="number" variant="standard" value={p.minQty} onChange={(e) => dispatch(updateProduct({ ...p, minQty: Number(e.target.value) }))} />
                </TableCell>
                <TableCell>
                  <TextField type="number" variant="standard" value={p.maxQty} onChange={(e) => dispatch(updateProduct({ ...p, maxQty: Number(e.target.value) }))} />
                </TableCell>
                <TableCell>
                  <Switch checked={p.active} onChange={(e) => dispatch(setProductActive({ id, active: e.target.checked }))} />
                </TableCell>
                <TableCell align="right">
                  <Button color="error" onClick={() => dispatch(removeProduct(id))}>Eliminar</Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
}
