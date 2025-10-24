import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Locations from './pages/Locations';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Transfers from './pages/Transfers';
import PurchaseOrders from './pages/PurchaseOrders';
import './App.css';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/products" element={<Products />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/transfers" element={<Transfers />} />
        <Route path="/purchase-orders" element={<PurchaseOrders />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
