import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

export default function FiltersBar({ filters, setFilters, onReset }) {
  return (
    <div className="filters-card">
      <div className="search-group">
        <Search className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por título, descripción o usuario solicitante..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
        />
      </div>

      <select
        className="filter-select"
        value={filters.categoria}
        onChange={(e) => setFilters({ ...filters, categoria: e.target.value, page: 1 })}
      >
        <option value="">Todas las Categorías</option>
        <option value="Hardware">Hardware</option>
        <option value="Software">Software</option>
        <option value="Red">Red</option>
        <option value="Accesos">Accesos</option>
        <option value="Otros">Otros</option>
      </select>

      <select
        className="filter-select"
        value={filters.prioridad}
        onChange={(e) => setFilters({ ...filters, prioridad: e.target.value, page: 1 })}
      >
        <option value="">Todas las Prioridades</option>
        <option value="Baja">Prioridad Baja</option>
        <option value="Media">Prioridad Media</option>
        <option value="Alta">Prioridad Alta</option>
        <option value="Crítica">Prioridad Crítica</option>
      </select>

      <select
        className="filter-select"
        value={filters.estado}
        onChange={(e) => setFilters({ ...filters, estado: e.target.value, page: 1 })}
      >
        <option value="">Todos los Estados</option>
        <option value="Pendiente">Pendiente</option>
        <option value="En progreso">En progreso</option>
        <option value="Resuelta">Resuelta</option>
        <option value="Cancelada">Cancelada</option>
      </select>

      <select
        className="filter-select"
        value={filters.ordering}
        onChange={(e) => setFilters({ ...filters, ordering: e.target.value })}
      >
        <option value="-fecha_creacion">Creación: Más recientes primero</option>
        <option value="fecha_creacion">Creación: Más antiguos primero</option>
        <option value="-fecha_actualizacion">Actualización: Más recientes primero</option>
        <option value="titulo">Título A-Z</option>
        <option value="-prioridad">Mayor Prioridad</option>
      </select>

      <button className="btn-secondary" onClick={onReset} title="Limpiar filtros">
        <RotateCcw size={16} />
      </button>
    </div>
  );
}
