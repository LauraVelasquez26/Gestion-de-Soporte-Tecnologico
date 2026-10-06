import React from 'react';
import { Eye, History, Edit3, ArrowRightLeft, Trash2, AlertCircle } from 'lucide-react';

export default function TicketTable({ tickets, onViewDetail, onHistory, onEdit, onChangeStatus, onDelete }) {
  if (!tickets || tickets.length === 0) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
        <AlertCircle size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
        <h3>No se encontraron solicitudes</h3>
        <p style={{ fontSize: '14px', marginTop: '6px' }}>Intenta ajustar tus términos de búsqueda o filtros.</p>
      </div>
    );
  }

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return <span className="badge badge-pendiente">⏱️ Pendiente</span>;
      case 'En progreso':
        return <span className="badge badge-en-progreso">⚡ En progreso</span>;
      case 'Resuelta':
        return <span className="badge badge-resuelta">✅ Resuelta</span>;
      case 'Cancelada':
        return <span className="badge badge-cancelada">🚫 Cancelada</span>;
      default:
        return <span className="badge">{estado}</span>;
    }
  };

  const getPriorityTag = (prioridad) => {
    switch (prioridad) {
      case 'Baja': return <span className="prio-tag prio-baja">🟢 Baja</span>;
      case 'Media': return <span className="prio-tag prio-media">🔵 Media</span>;
      case 'Alta': return <span className="prio-tag prio-alta">🟡 Alta</span>;
      case 'Crítica': return <span className="prio-tag prio-critica">🔴 Crítica</span>;
      default: return <span>{prioridad}</span>;
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString('es-CO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Solicitud</th>
            <th>Solicitante</th>
            <th>Categoría</th>
            <th>Prioridad</th>
            <th>Estado</th>
            <th>Fecha Creación</th>
            <th>Fecha Actualización</th>
            <th style={{ textAlign: 'right', minWidth: '210px', paddingRight: '24px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td style={{ fontWeight: '700', color: '#6366f1', width: '60px' }}>#{ticket.id}</td>
              <td style={{ maxWidth: '280px', minWidth: '200px' }}>
                <div 
                  style={{ fontWeight: '600', color: '#f8fafc', marginBottom: '2px', cursor: 'pointer' }}
                  onClick={() => onViewDetail(ticket)}
                  title="Haz clic para ver el detalle completo"
                >
                  <span style={{ textDecoration: 'underline', textDecorationColor: 'rgba(99, 102, 241, 0.4)' }}>
                    {ticket.titulo}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {ticket.descripcion}
                </div>
              </td>
              <td style={{ whiteSpace: 'nowrap' }}>{ticket.usuario_solicitante}</td>
              <td>
                <span style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', whiteSpace: 'nowrap' }}>
                  {ticket.categoria}
                </span>
              </td>
              <td style={{ whiteSpace: 'nowrap' }}>{getPriorityTag(ticket.prioridad)}</td>
              <td style={{ whiteSpace: 'nowrap' }}>{getStatusBadge(ticket.estado)}</td>
              <td style={{ fontSize: '13px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{formatDate(ticket.fecha_creacion)}</td>
              <td style={{ fontSize: '13px', color: '#38bdf8', whiteSpace: 'nowrap' }}>{formatDate(ticket.fecha_actualizacion)}</td>
              <td style={{ minWidth: '210px', paddingRight: '24px' }}>
                <div className="action-buttons" style={{ justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                  <button className="btn-icon" onClick={() => onViewDetail(ticket)} title="Consultar Detalle Completo" style={{ color: '#38bdf8' }}>
                    <Eye size={16} />
                  </button>
                  <button className="btn-icon" onClick={() => onHistory(ticket)} title="Ver Historial de Auditoría">
                    <History size={16} />
                  </button>
                  <button className="btn-icon" onClick={() => onEdit(ticket)} title="Editar Detalles">
                    <Edit3 size={16} />
                  </button>
                  <button 
                    className="btn-icon" 
                    onClick={() => onChangeStatus(ticket)} 
                    title="Cambiar Estado de Solicitud"
                    style={{ color: '#60a5fa' }}
                  >
                    <ArrowRightLeft size={16} />
                  </button>
                  <button className="btn-icon" onClick={() => onDelete(ticket.id)} title="Eliminar Solicitud" style={{ color: '#f87171' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
