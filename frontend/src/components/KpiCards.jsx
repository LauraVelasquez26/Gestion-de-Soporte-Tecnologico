import React from 'react';
import { Ticket, Clock, PlayCircle, CheckCircle2, XCircle } from 'lucide-react';

export default function KpiCards({ stats, currentFilter, onSelectFilter }) {
  const cards = [
    { key: '', label: 'Total Solicitudes', value: stats.total || 0, color: '#6366f1', icon: Ticket },
    { key: 'Pendiente', label: 'Pendientes', value: stats.pendiente || 0, color: '#fbbf24', icon: Clock },
    { key: 'En progreso', label: 'En Progreso', value: stats.en_progreso || 0, color: '#60a5fa', icon: PlayCircle },
    { key: 'Resuelta', label: 'Resueltas', value: stats.resuelta || 0, color: '#34d399', icon: CheckCircle2 },
    { key: 'Cancelada', label: 'Canceladas', value: stats.cancelada || 0, color: '#f87171', icon: XCircle },
  ];

  return (
    <div className="kpi-grid">
      {cards.map((c) => {
        const Icon = c.icon;
        const isActive = currentFilter === c.key;
        return (
          <div
            key={c.key}
            className={`kpi-card ${isActive ? 'active' : ''}`}
            onClick={() => onSelectFilter(c.key)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="kpi-title">{c.label}</span>
              <Icon size={18} color={c.color} />
            </div>
            <div className="kpi-value" style={{ color: c.color }}>
              {c.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
