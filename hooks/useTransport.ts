import { useState, useEffect } from 'react';
import { useUserSession } from "@/store/auth";

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
  const user = useUserSession((state) => state.user);
  const schoolId = user?.schoolId;

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!schoolId) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/transport/vehicles?schoolId=${schoolId}`);
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
  }, [schoolId]);

  return { vehicles, loading, error };
}

export function useDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserSession((state) => state.user);
  const schoolId = user?.schoolId;

  useEffect(() => {
    const fetchDrivers = async () => {
      if (!schoolId) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/transport/drivers?schoolId=${schoolId}`);
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
  }, [schoolId]);

  return { drivers, loading, error };
}

export function useTransportRoutes() {
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserSession((state) => state.user);
  const schoolId = user?.schoolId;

  useEffect(() => {
    const fetchRoutes = async () => {
      if (!schoolId) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/transport/routes?schoolId=${schoolId}`);
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
  }, [schoolId]);

  return { routes, loading, error };
}

export function useMaintenanceRecords() {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserSession((state) => state.user);
  const schoolId = user?.schoolId;

  useEffect(() => {
    const fetchRecords = async () => {
      if (!schoolId) return;
      try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/transport/maintenance?schoolId=${schoolId}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error(`Failed to fetch maintenance records: ${response.status} ${response.statusText}`);
          throw new Error('Failed to fetch maintenance records');
        }
        
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
  }, [schoolId]);

  return { records, loading, error };
}

export function useTransportStats() {
  const [stats, setStats] = useState<TransportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUserSession((state) => state.user);
  const schoolId = user?.schoolId;

  useEffect(() => {
    const fetchStats = async () => {
      if (!schoolId) return;
      try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/v1/transport/stats?schoolId=${schoolId}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error(`Failed to fetch transport stats: ${response.status} ${response.statusText}`);
          throw new Error('Failed to fetch transport stats');
        }
        
        const result = await response.json();
        setStats(result.data || {
          totalVehicles: 0,
          activeVehicles: 0,
          totalDrivers: 0,
          activeDrivers: 0,
          totalRoutes: 0
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Transport stats fetch error:', err);
        // Set default stats to avoid UI crashes
        setStats({
          totalVehicles: 0,
          activeVehicles: 0,
          totalDrivers: 0,
          activeDrivers: 0,
          totalRoutes: 0
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [schoolId]);

  return { stats, loading, error };
}
