import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export default function TicketModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    usuario_solicitante: '',
    categoria: 'Hardware',
    prioridad: 'Media'
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        titulo: initialData.titulo || '',
        descripcion: initialData.descripcion || '',
        usuario_solicitante: initialData.usuario_solicitante || '',
        categoria: initialData.categoria || 'Hardware',
        prioridad: initialData.prioridad || 'Media'
      });
    } else {
      setFormData({
        titulo: '',
        descripcion: '',
        usuario_solicitante: '',
        categoria: 'Hardware',
        prioridad: 'Media'
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const isClosedState = initialData && ['Resuelta', 'Cancelada'].includes(initialData.estado);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isClosedState) {
      setError(`No se puede editar una solicitud en estado '${initialData.estado}' porque es un estado final.`);
      return;
    }
    if (!formData.titulo.trim()) {
      setError('El título es obligatorio.');
      return;
    }
    if (formData.titulo.length < 5) {
      setError('El título debe tener al menos 5 caracteres.');
      return;
    }
    if (!formData.descripcion.trim()) {
      setError('La descripción es obligatoria.');
      return;
    }
    if (!formData.usuario_solicitante.trim()) {
      setError('El usuario solicitante es obligatorio.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {initialData ? `Editar Solicitud #${initialData.id}` : 'Crear Nueva Solicitud de Soporte'}
          </h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {isClosedState && (
          <div className="error-banner" style={{ background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)', color: '#fbbf24' }}>
            🔒 <strong>Regla de Negocio Adicional:</strong> Esta solicitud se encuentra en estado <strong>{initialData.estado}</strong> (Estado final). No se permite modificar su información original para preservar la integridad del historial de auditoría.
          </div>
        )}

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Título de la Solicitud *</label>
            <input
              type="text"
              className="form-input"
              disabled={isClosedState}
              placeholder="Ej. Fallo en red Wifi piso 2"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Usuario Solicitante *</label>
            <input
              type="text"
              className="form-input"
              disabled={isClosedState}
              placeholder="Ej. María López"
              value={formData.usuario_solicitante}
              onChange={(e) => setFormData({ ...formData, usuario_solicitante: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Categoría *</label>
              <select
                className="form-select"
                disabled={isClosedState}
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              >
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Red">Red</option>
                <option value="Accesos">Accesos</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Prioridad *</label>
              <select
                className="form-select"
                disabled={isClosedState}
                value={formData.prioridad}
                onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción Detallada *</label>
            <textarea
              className="form-textarea"
              disabled={isClosedState}
              placeholder="Describe detalladamente el problema o requerimiento tecnológico..."
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              {isClosedState ? 'Cerrar' : 'Cancelar'}
            </button>
            {!isClosedState && (
              <button type="submit" className="btn-primary">
                <Save size={16} />
                <span>{initialData ? 'Guardar Cambios' : 'Crear Solicitud'}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
