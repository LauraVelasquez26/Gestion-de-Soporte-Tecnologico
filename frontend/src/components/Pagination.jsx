import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ count, currentPage, pageSize, onPageChange, onPageSizeChange }) {
  const totalPages = Math.ceil(count / pageSize) || 1;

  return (
    <div className="pagination-container">
      <div className="page-info">
        Mostrando página <strong style={{ color: '#f8fafc' }}>{currentPage}</strong> de <strong style={{ color: '#f8fafc' }}>{totalPages}</strong> ({count} solicitudes en total)
      </div>

      <div className="pagination-controls">
        <label style={{ fontSize: '13px', color: '#94a3b8', marginRight: '8px' }}>
          Por página:
        </label>
        <select
          className="filter-select"
          style={{ minWidth: '70px', padding: '6px 10px', fontSize: '13px' }}
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>

        <button
          className="btn-secondary"
          style={{ padding: '6px 12px' }}
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} />
        </button>

        <span style={{ fontSize: '14px', fontWeight: '600', padding: '0 8px' }}>
          {currentPage} / {totalPages}
        </span>

        <button
          className="btn-secondary"
          style={{ padding: '6px 12px' }}
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
