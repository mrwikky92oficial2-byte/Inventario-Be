import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

export default function Dashboard() {
  const products = useSelector((s: RootState) => s.products);
  const inventory = useSelector((s: RootState) => s.inventory);

  const lowStock: Array<{ name: string; quantity: number }> = [];
  for (const invId of inventory.allIds) {
    const inv = inventory.byId[invId];
    const product = products.byId[inv.productId];
    if (product && inv.quantity < product.minQty) {
      lowStock.push({ name: product.name, quantity: inv.quantity });
    }
  }

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Panel de Inventario
      </Typography>
      <Typography variant="subtitle1">Alertas de bajo stock</Typography>
      {lowStock.length === 0 ? (
        <Typography color="text.secondary">No hay alertas</Typography>
      ) : (
        <List>
          {lowStock.map((i, idx) => (
            <ListItem key={idx}>
              <ListItemText primary={i.name} secondary={`Cantidad: ${i.quantity}`} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
