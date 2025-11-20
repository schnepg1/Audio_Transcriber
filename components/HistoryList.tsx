
import React from 'react';
import { TranscriptionRecord } from '../types';
import { Clock, Trash2, FileText, Eye } from 'lucide-react';

interface HistoryListProps {
  history: TranscriptionRecord[];
  onSelect: (record: TranscriptionRecord) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onDelete, onClear }) => {
  if (history.length === 0) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full space-y-4 border-t border-slate-700 pt-6 mt-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-400" />
          History
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Clear All
        </button>
      </div>

      <div className="grid gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {history.map((record) => (
          <div
            key={record.id}
            className="bg-slate-750 border border-slate-700 rounded-lg p-3 hover:bg-slate-700 transition-all group"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0 mr-3">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-3 h-3 text-sky-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-200 truncate block">
                    {record.fileName}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mb-2">
                  {formatDate(record.timestamp)}
                </div>
                <p className="text-xs text-slate-400 truncate">
                  {record.text}
                </p>
              </div>
              
              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-100">
                <button
                  onClick={() => onSelect(record)}
                  title="View"
                  className="p-1.5 bg-sky-500/10 text-sky-400 rounded hover:bg-sky-500 hover:text-white transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(record.id);
                  }}
                  title="Delete"
                  className="p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};
