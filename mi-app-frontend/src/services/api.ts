// Servicio para manejar las llamadas a la API del backend
const API_BASE_URL = 'http://localhost:3000/api';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

export interface NuevoProducto {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock?: number;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
      throw new Error(errorData.error || `Error ${response.status}`);
    }

    return response.json();
  }

  // Obtener todos los productos
  async getProductos(): Promise<Producto[]> {
    return this.request<Producto[]>('/productos');
  }

  // Obtener un producto por ID
  async getProducto(id: number): Promise<Producto> {
    return this.request<Producto>(`/productos/${id}`);
  }

  // Crear un nuevo producto
  async crearProducto(producto: NuevoProducto): Promise<Producto> {
    return this.request<Producto>('/productos', {
      method: 'POST',
      body: JSON.stringify(producto),
    });
  }

  // Actualizar un producto
  async actualizarProducto(id: number, producto: Partial<NuevoProducto>): Promise<Producto> {
    return this.request<Producto>(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(producto),
    });
  }

  // Eliminar un producto
  async eliminarProducto(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/productos/${id}`, {
      method: 'DELETE',
    });
  }

  // Reservar stock
  async reservarStock(reserva: ReservaInput): Promise<ReservaOutput> {
    return this.request<ReservaOutput>('/stock/reservar', {
      method: 'POST',
      body: JSON.stringify(reserva),
    });
  }
}

export const apiService = new ApiService();

// --- Interfaces para Stock ---

export interface ReservaProducto {
  idProducto: number;
  cantidad: number;
}

export interface ReservaInput {
  idCompra: string;
  usuarioId: number;
  productos: ReservaProducto[];
}

export interface ReservaOutput {
  idReserva: number;
  idCompra: string;
  usuarioId: number;
  estado: string;
  fechaCreacion: string;
}
