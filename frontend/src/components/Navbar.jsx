import React from 'react';
import { Wrench, Plus, Server } from 'lucide-react';

export default function Navbar({ onOpenCreateModal }) {
  return (
    <nav className="navbar">
      <div className="brand">
        <div className="brand-icon">🛠️</div>
        <div>
          <h1 className="brand-title">Gestión de Soporte Tecnológico</h1>
          <p className="brand-subtitle">Plataforma Interna de Tickets y Auditoría de Estados</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#34d399', background: 'rgba(52, 211, 153, 0.1)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
          <Server size={14} />
          <span>Django Backend Activo</span>
        </div>
        <button className="btn-primary" onClick={onOpenCreateModal}>
          <Plus size={18} />
          <span>Nueva Solicitud</span>
        </button>
      </div>
    </nav>
  );
}
