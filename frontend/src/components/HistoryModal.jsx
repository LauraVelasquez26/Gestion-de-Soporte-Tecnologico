import React from 'react';
import { X, History, User, Calendar, MessageSquare } from 'lucide-react';

export default function HistoryModal({ isOpen, onClose, ticket, historyList }) {
  if (!isOpen || !ticket) return null;

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={20} color="#6366f1" />
            <h2 className="modal-title">Historial de Auditoría - Solicitud #{ticket.id}</h2>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
          <div style={{ fontWeight: '700', fontSize: '15px' }}>{ticket.titulo}</div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
            Solicitante: <strong>{ticket.usuario_solicitante}</strong> | Categoría: <strong>{ticket.categoria}</strong>
          </div>
        </div>

        {!historyList || historyList.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
            No se registran cambios de estado en esta solicitud.
          </div>
        ) : (
          <div className="timeline" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {historyList.map((item) => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-box">
                  <div className="timeline-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {formatDate(item.fecha_cambio)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f8fafc' }}>
                      <User size={12} /> {item.usuario_responsable}
                    </span>
                  </div>

                  <div className="timeline-desc">
                    Cambió de <strong style={{ color: '#fbbf24' }}>{item.estado_anterior}</strong> a <strong style={{ color: '#34d399' }}>{item.estado_nuevo}</strong>
                  </div>

                  {item.observacion && (
                    <div className="timeline-obs">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', marginBottom: '2px' }}>
                        <MessageSquare size={12} /> Observación:
                      </div>
                      <div>{item.observacion}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
