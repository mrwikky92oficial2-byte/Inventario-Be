import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import type { RootState } from '../store';
import type { LocationType } from '../types';
import { addLocation, removeLocation, setLocationActive, updateLocation } from '../slices/locationsSlice';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Switch,
  Stack,
} from '@mui/material';

export default function Locations() {
  const dispatch = useDispatch();
  const locations = useSelector((s: RootState) => s.locations);

  const [name, setName] = useState('');
  const [type, setType] = useState<LocationType>('store');
  const [address, setAddress] = useState('');

  const onAdd = () => {
    if (!name.trim()) return;
    dispatch(
      addLocation({
        id: uuid(),
        name,
        type,
        address,
        active: true,
      })
    );
    setName('');
    setAddress('');
    setType('store');
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Tiendas y Bodegas
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <TextField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField select label="Tipo" value={type} onChange={(e) => setType(e.target.value as LocationType)}>
          <MenuItem value="store">Tienda</MenuItem>
          <MenuItem value="warehouse">Bodega</MenuItem>
        </TextField>
        <TextField label="Dirección" value={address} onChange={(e) => setAddress(e.target.value)} />
        <Button variant="contained" onClick={onAdd}>
          Agregar
        </Button>
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Dirección</TableCell>
            <TableCell>Activa</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {locations.allIds.map((id) => {
            const loc = locations.byId[id];
            return (
              <TableRow key={id}>
                <TableCell>
                  <TextField
                    variant="standard"
                    value={loc.name}
                    onChange={(e) =>
                      dispatch(updateLocation({ ...loc, name: e.target.value }))
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    select
                    variant="standard"
                    value={loc.type}
                    onChange={(e) =>
                      dispatch(updateLocation({ ...loc, type: e.target.value as LocationType }))
                    }
                  >
                    <MenuItem value="store">Tienda</MenuItem>
                    <MenuItem value="warehouse">Bodega</MenuItem>
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    variant="standard"
                    value={loc.address ?? ''}
                    onChange={(e) =>
                      dispatch(updateLocation({ ...loc, address: e.target.value }))
                    }
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={loc.active}
                    onChange={(e) =>
                      dispatch(setLocationActive({ id, active: e.target.checked }))
                    }
                  />
                </TableCell>
                <TableCell align="right">
                  <Button color="error" onClick={() => dispatch(removeLocation(id))}>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
}
