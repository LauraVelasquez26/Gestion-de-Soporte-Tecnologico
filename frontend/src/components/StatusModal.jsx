import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

const TODOS_LOS_ESTADOS = ['Pendiente', 'En progreso', 'Resuelta', 'Cancelada'];

const TRANSICIONES_PERMITIDAS = {
  'Pendiente': ['En progreso', 'Cancelada'],
  'En progreso': ['Resuelta', 'Cancelada'],
  'Resuelta': [],  // Terminal
  'Cancelada': []  // Terminal
};

export default function StatusModal({ isOpen, onClose, onSubmit, ticket }) {
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [usuarioResponsable, setUsuarioResponsable] = useState('Soporte TI - Operador');
  const [observacion, setObservacion] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ticket) {
      const allowed = TRANSICIONES_PERMITIDAS[ticket.estado] || [];
      // Por defecto seleccionar el primer estado permitido o el actual si es terminal
      setNuevoEstado(allowed.length > 0 ? allowed[0] : ticket.estado);
      setObservacion('');
      setError(null);
    }
  }, [ticket, isOpen]);

  if (!isOpen || !ticket) return null;

  const allowedStates = TRANSICIONES_PERMITIDAS[ticket.estado] || [];
  const isInvalidTransition = nuevoEstado !== ticket.estado && !allowedStates.includes(nuevoEstado);
  const isCriticaResuelta = ticket.prioridad === 'Crítica' && nuevoEstado === 'Resuelta';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (nuevoEstado === ticket.estado) {
      setError('Selecciona un estado diferente al estado actual.');
      return;
    }

    if (isInvalidTransition) {
      setError(`Transición no permitida: No se puede cambiar de '${ticket.estado}' a '${nuevoEstado}'. Transiciones válidas desde '${ticket.estado}': [${allowedStates.join(', ') || 'Ninguna'}].`);
      return;
    }

    if (!usuarioResponsable.trim()) {
      setError('El usuario responsable es obligatorio.');
      return;
    }

    if (isCriticaResuelta && !observacion.trim()) {
      setError('⚠️ Es OBLIGATORIO registrar una observación al marcar como Resuelta una solicitud con prioridad Crítica.');
      return;
    }

    onSubmit({
      nuevo_estado: nuevoEstado,
      usuario_responsable: usuarioResponsable,
      observacion: observacion
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Cambiar Estado - Solicitud #{ticket.id}</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Resumen del Ticket */}
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-color)', padding: '14px 16px', borderRadius: '10px', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Solicitud #{ticket.id}</div>
          <div style={{ fontWeight: '700', fontSize: '15px', color: '#f8fafc', marginBottom: '6px' }}>{ticket.titulo}</div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
            <span>Estado Actual: <strong style={{ color: '#fbbf24' }}>{ticket.estado}</strong></span>
            <span>Prioridad: <strong style={{ color: ticket.prioridad === 'Crítica' ? '#ef4444' : '#38bdf8' }}>{ticket.prioridad}</strong></span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-banner">{error}</div>}

          {/* Banner si selecciona una transición inválida */}
          {isInvalidTransition && (
            <div className="error-banner" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} />
              <span>Transición no permitida según reglas de negocio (De '{ticket.estado}' solo puedes pasar a: <strong>{allowedStates.join(', ') || 'Ninguno'}</strong>).</span>
            </div>
          )}

          {/* Banner de regla de prioridad Crítica */}
          {isCriticaResuelta && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '10px 14px', borderRadius: '8px', color: '#f87171', fontSize: '13px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} />
              <span>Regla de Negocio: Se requiere una <strong>Observación Obligatoria</strong> por ser prioridad Crítica.</span>
            </div>
          )}

          {/* Selector con TODOS los estados */}
          <div className="form-group">
            <label className="form-label">Nuevo Estado * (Todos los estados disponibles)</label>
            <select
              className="form-select"
              value={nuevoEstado}
              onChange={(e) => {
                setNuevoEstado(e.target.value);
                setError(null);
              }}
            >
              {TODOS_LOS_ESTADOS.map((st) => (
                <option key={st} value={st}>
                  {st} {st === ticket.estado ? '(Actual)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Usuario Responsable del Cambio *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej. Soporte TI - Andrés"
              value={usuarioResponsable}
              onChange={(e) => setUsuarioResponsable(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Observación {isCriticaResuelta ? '(OBLIGATORIA)' : '(Opcional)'}
            </label>
            <textarea
              className="form-textarea"
              placeholder={isCriticaResuelta ? 'Ingresa los detalles de la solución aplicada...' : 'Detalle u observación del cambio de estado...'}
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isInvalidTransition}>
              <CheckCircle size={16} />
              <span>Confirmar Cambio</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
