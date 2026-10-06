const API_BASE_URL = 'http://127.0.0.1:8000/api';

export async function fetchTickets(filters = {}) {
  const query = new URLSearchParams();
  if (filters.search) query.append('search', filters.search);
  if (filters.categoria) query.append('categoria', filters.categoria);
  if (filters.prioridad) query.append('prioridad', filters.prioridad);
  if (filters.estado) query.append('estado', filters.estado);
  if (filters.ordering) query.append('ordering', filters.ordering);
  if (filters.page) query.append('page', filters.page);
  if (filters.page_size) query.append('page_size', filters.page_size);

  const res = await fetch(`${API_BASE_URL}/tickets/?${query.toString()}`);
  if (!res.ok) throw new Error('Error al cargar las solicitudes');
  return res.json();
}

export async function fetchTicketStats() {
  const res = await fetch(`${API_BASE_URL}/tickets/stats/`);
  if (!res.ok) throw new Error('Error al cargar las estadísticas');
  return res.json();
}

export async function createTicket(data) {
  const res = await fetch(`${API_BASE_URL}/tickets/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) {
    const errorMsg = typeof json === 'object' ? Object.values(json).flat().join(', ') : 'Error al crear la solicitud';
    throw new Error(errorMsg);
  }
  return json;
}

export async function updateTicket(id, data) {
  const res = await fetch(`${API_BASE_URL}/tickets/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) {
    const errorMsg = typeof json === 'object' ? Object.values(json).flat().join(', ') : 'Error al actualizar';
    throw new Error(errorMsg);
  }
  return json;
}

export async function deleteTicket(id) {
  const res = await fetch(`${API_BASE_URL}/tickets/${id}/`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar la solicitud');
  return true;
}

export async function changeTicketStatus(id, statusData) {
  const res = await fetch(`${API_BASE_URL}/tickets/${id}/cambiar-estado/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(statusData)
  });
  const json = await res.json();
  if (!res.ok) {
    const errorMsg = json.error || (typeof json === 'object' ? Object.values(json).flat().join(', ') : 'Error al cambiar el estado');
    throw new Error(errorMsg);
  }
  return json;
}

export async function fetchTicketHistory(id) {
  const res = await fetch(`${API_BASE_URL}/tickets/${id}/historial/`);
  if (!res.ok) throw new Error('Error al obtener el historial');
  return res.json();
}
