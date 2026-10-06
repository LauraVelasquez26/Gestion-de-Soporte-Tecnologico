import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import KpiCards from './components/KpiCards';
import FiltersBar from './components/FiltersBar';
import TicketTable from './components/TicketTable';
import Pagination from './components/Pagination';
import TicketModal from './components/TicketModal';
import StatusModal from './components/StatusModal';
import HistoryModal from './components/HistoryModal';
import DetailModal from './components/DetailModal';

import {
  fetchTickets,
  fetchTicketStats,
  createTicket,
  updateTicket,
  deleteTicket,
  changeTicketStatus,
  fetchTicketHistory
} from './api';

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({ total: 0, pendiente: 0, en_progreso: 0, resuelta: 0, cancelada: 0 });
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Filtros y Paginación
  const [filters, setFilters] = useState({
    search: '',
    categoria: '',
    prioridad: '',
    estado: '',
    ordering: '-fecha_creacion',
    page: 1,
    page_size: 10
  });

  // Modales
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailTargetTicket, setDetailTargetTicket] = useState(null);

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusTargetTicket, setStatusTargetTicket] = useState(null);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyTargetTicket, setHistoryTargetTicket] = useState(null);
  const [historyList, setHistoryList] = useState([]);

  const showToast = (msg, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTickets(filters);
      setTickets(data.results || data);
      setTotalCount(data.count || (Array.isArray(data) ? data.length : 0));

      const statsData = await fetchTicketStats();
      setStats(statsData);
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      categoria: '',
      prioridad: '',
      estado: '',
      ordering: '-fecha_creacion',
      page: 1,
      page_size: 10
    });
  };

  // Crear / Editar Solicitud
  const handleSaveTicket = async (formData) => {
    try {
      if (editingTicket) {
        await updateTicket(editingTicket.id, formData);
        showToast(`Solicitud #${editingTicket.id} actualizada correctamente.`);
      } else {
        const newTicket = await createTicket(formData);
        showToast(`Solicitud #${newTicket.id} creada exitosamente.`);
      }
      setIsTicketModalOpen(false);
      setEditingTicket(null);
      loadData();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  // Eliminar Solicitud
  const handleDeleteTicket = async (id) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la solicitud #${id}?`)) {
      try {
        await deleteTicket(id);
        showToast(`Solicitud #${id} eliminada.`);
        loadData();
      } catch (err) {
        showToast(err.message, true);
      }
    }
  };

  // Cambiar Estado
  const handleConfirmChangeStatus = async (statusData) => {
    try {
      const res = await changeTicketStatus(statusTargetTicket.id, statusData);
      showToast(res.mensaje || 'Estado actualizado con éxito.');
      setIsStatusModalOpen(false);
      setStatusTargetTicket(null);
      loadData();
    } catch (err) {
      showToast(err.message, true);
    }
  };

  // Abrir Modal de Historial
  const handleOpenHistory = async (ticket) => {
    setHistoryTargetTicket(ticket);
    try {
      const history = await fetchTicketHistory(ticket.id);
      setHistoryList(history);
      setIsHistoryModalOpen(true);
    } catch (err) {
      showToast(err.message, true);
    }
  };

  // Abrir Modal de Detalle
  const handleOpenDetail = (ticket) => {
    setDetailTargetTicket(ticket);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="app-container">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: toastMessage.isError ? '#ef4444' : '#10b981',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '10px',
          fontWeight: '600',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          animation: 'modalFadeIn 0.2s ease-out'
        }}>
          {toastMessage.text}
        </div>
      )}

      {/* Navbar */}
      <Navbar onOpenCreateModal={() => { setEditingTicket(null); setIsTicketModalOpen(true); }} />

      {/* KPIs Dashboard */}
      <KpiCards
        stats={stats}
        currentFilter={filters.estado}
        onSelectFilter={(st) => setFilters({ ...filters, estado: st, page: 1 })}
      />

      {/* Barra de Filtros y Búsqueda */}
      <FiltersBar
        filters={filters}
        setFilters={setFilters}
        onReset={handleResetFilters}
      />

      {/* Tabla de Resultados */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
          Cargando solicitudes...
        </div>
      ) : (
        <TicketTable
          tickets={tickets}
          onViewDetail={handleOpenDetail}
          onHistory={handleOpenHistory}
          onEdit={(t) => { setEditingTicket(t); setIsTicketModalOpen(true); }}
          onChangeStatus={(t) => { setStatusTargetTicket(t); setIsStatusModalOpen(true); }}
          onDelete={handleDeleteTicket}
        />
      )}

      {/* Paginación */}
      <Pagination
        count={totalCount}
        currentPage={filters.page}
        pageSize={filters.page_size}
        onPageChange={(p) => setFilters({ ...filters, page: p })}
        onPageSizeChange={(ps) => setFilters({ ...filters, page_size: ps, page: 1 })}
      />

      {/* Modales */}
      <DetailModal
        isOpen={isDetailModalOpen}
        onClose={() => { setIsDetailModalOpen(false); setDetailTargetTicket(null); }}
        ticket={detailTargetTicket}
        onOpenHistory={handleOpenHistory}
        onOpenEdit={(t) => { setEditingTicket(t); setIsTicketModalOpen(true); }}
      />

      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => { setIsTicketModalOpen(false); setEditingTicket(null); }}
        onSubmit={handleSaveTicket}
        initialData={editingTicket}
      />

      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={() => { setIsStatusModalOpen(false); setStatusTargetTicket(null); }}
        onSubmit={handleConfirmChangeStatus}
        ticket={statusTargetTicket}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => { setIsHistoryModalOpen(false); setHistoryTargetTicket(null); }}
        ticket={historyTargetTicket}
        historyList={historyList}
      />
    </div>
  );
}
