import { useState, useEffect } from 'react';

export interface Vehicle {
  id: string;
  registrationNo: string;
  model: string;
  manufacturer: string | null;
  year: number | null;
  capacity: number;
  status: string;
  lastMaintenance: string | null;
  nextMaintenance: string | null;
  routes: any[];
  maintenanceRecords: any[];
}

export interface Driver {
  id: string;
  name: string;
  licenseNo: string;
  phone: string;
  email: string | null;
  experience: number;
  status: string;
  routes: any[];
}

export interface TransportRoute {
  id: string;
  name: string;
  routeNo: string;
  stops: string;
  schedule: string;
  vehicle: any;
  driver: any;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: string;
  description: string;
  cost: number;
  date: string;
  nextDue: string | null;
  performedBy: string | null;
  status: string;
  vehicle: any;
}

export interface TransportStats {
  totalVehicles: number;
  activeVehicles: number;
  totalDrivers: number;
  activeDrivers: number;
  totalRoutes: number;
}

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/transport/vehicles`);
        if (!response.ok) throw new Error('Failed to fetch vehicles');
        const result = await response.json();
        setVehicles(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Vehicles fetch error:', err);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  return { vehicles, loading, error };
}

export function useDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/transport/drivers`);
        if (!response.ok) throw new Error('Failed to fetch drivers');
        const result = await response.json();
        setDrivers(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Drivers fetch error:', err);
        setDrivers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  return { drivers, loading, error };
}

export function useTransportRoutes() {
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/transport/routes`);
        if (!response.ok) throw new Error('Failed to fetch routes');
        const result = await response.json();
        setRoutes(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Routes fetch error:', err);
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  return { routes, loading, error };
}

export function useMaintenanceRecords() {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/transport/maintenance`);
        if (!response.ok) throw new Error('Failed to fetch maintenance records');
        const result = await response.json();
        setRecords(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Maintenance records fetch error:', err);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  return { records, loading, error };
}

export function useTransportStats() {
  const [stats, setStats] = useState<TransportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/transport/stats`);
        if (!response.ok) throw new Error('Failed to fetch transport stats');
        const result = await response.json();
        setStats(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Transport stats fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, loading, error };
}
