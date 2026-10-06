import React from 'react';
import { X, FileText, User, Tag, AlertCircle, Clock, Calendar, History, Edit3 } from 'lucide-react';

export default function DetailModal({ isOpen, onClose, ticket, onOpenHistory, onOpenEdit }) {
  if (!isOpen || !ticket) return null;

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={22} color="#6366f1" />
            <div>
              <h2 className="modal-title">Detalle de la Solicitud #{ticket.id}</h2>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Información completa registrada</span>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Header summary box */}
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-highlight)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#f8fafc', marginBottom: '8px' }}>
            {ticket.titulo}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <div>Estado: {getStatusBadge(ticket.estado)}</div>
            <div>Prioridad: {getPriorityTag(ticket.prioridad)}</div>
            <div style={{ fontSize: '13px', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '6px' }}>
              Categoría: <strong>{ticket.categoria}</strong>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <User size={14} color="#38bdf8" /> Usuario Solicitante
            </div>
            <div style={{ fontWeight: '600', fontSize: '15px' }}>{ticket.usuario_solicitante}</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Tag size={14} color="#fbbf24" /> ID de Identificación
            </div>
            <div style={{ fontWeight: '600', fontSize: '15px', color: '#6366f1' }}>Ticket #{ticket.id}</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Calendar size={14} color="#94a3b8" /> Fecha de Creación
            </div>
            <div style={{ fontWeight: '500', fontSize: '13px', color: '#f8fafc' }}>
              {formatDate(ticket.fecha_creacion)}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Clock size={14} color="#38bdf8" /> Última Actualización
            </div>
            <div style={{ fontWeight: '500', fontSize: '13px', color: '#38bdf8' }}>
              {formatDate(ticket.fecha_actualizacion)}
            </div>
          </div>
        </div>

        {/* Full description */}
        <div style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ fontSize: '13px', color: '#94a3b8' }}>
            Descripción Completa de la Solicitud:
          </label>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '14px 16px',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#f8fafc',
            whiteSpace: 'pre-wrap',
            maxHeight: '180px',
            overflowY: 'auto'
          }}>
            {ticket.descripcion}
          </div>
        </div>

        {/* Modal actions footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" onClick={() => { onClose(); onOpenHistory(ticket); }}>
              <History size={16} />
              <span>Ver Historial Auditoría</span>
            </button>
            <button className="btn-secondary" onClick={() => { onClose(); onOpenEdit(ticket); }}>
              <Edit3 size={16} />
              <span>Editar Solicitud</span>
            </button>
          </div>
          <button className="btn-primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
