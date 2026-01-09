
import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from '../types';

interface OutletCardProps {
  outlet: Outlet;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onUpdate: (id: string, updates: Partial<Outlet>) => void;
}

const OutletCard: React.FC<OutletCardProps> = ({ outlet, onDragStart, onUpdate }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [localName, setLocalName] = useState(outlet.name);
  const [localDesc, setLocalDesc] = useState(outlet.description);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditingName) nameInputRef.current?.focus();
  }, [isEditingName]);

  useEffect(() => {
    if (isEditingDesc) descInputRef.current?.focus();
  }, [isEditingDesc]);

  const handleNameBlur = () => {
    setIsEditingName(false);
    if (localName !== outlet.name) {
      onUpdate(outlet.id, { name: localName });
    }
  };

  const handleDescBlur = () => {
    setIsEditingDesc(false);
    if (localDesc !== outlet.description) {
      onUpdate(outlet.id, { description: localDesc });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value).getTime();
    if (!isNaN(newDate)) {
      onUpdate(outlet.id, { timestamp: newDate });
    }
  };

  const priorityColor = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  }[outlet.priority];

  // Format date for the input (YYYY-MM-DD)
  const dateValue = new Date(outlet.timestamp).toISOString().split('T')[0];

  return (
    <div
      draggable={!isEditingName && !isEditingDesc}
      onDragStart={(e) => onDragStart(e, outlet.id)}
      className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all cursor-grab active:cursor-grabbing mb-3 group"
    >
      <div className="flex justify-between items-start mb-2">
        <div className={`w-2 h-2 rounded-full ${priorityColor}`} title={`Priority: ${outlet.priority}`} />
        <span className="text-[10px] text-slate-400 font-medium">ID: {outlet.id.toUpperCase()}</span>
      </div>

      {isEditingName ? (
        <input
          ref={nameInputRef}
          className="w-full font-semibold text-slate-800 mb-1 border-b border-blue-500 outline-none"
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          onBlur={handleNameBlur}
          onKeyDown={(e) => e.key === 'Enter' && handleNameBlur()}
        />
      ) : (
        <h3 
          onClick={() => setIsEditingName(true)}
          className="font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors cursor-text flex items-center justify-between"
        >
          {outlet.name}
          <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </h3>
      )}

      {isEditingDesc ? (
        <textarea
          ref={descInputRef}
          className="w-full text-xs text-slate-600 mb-2 border rounded p-2 outline-none resize-none bg-slate-50"
          rows={3}
          value={localDesc}
          onChange={(e) => setLocalDesc(e.target.value)}
          onBlur={handleDescBlur}
        />
      ) : (
        <p 
          onClick={() => setIsEditingDesc(true)}
          className="text-xs text-slate-600 mb-3 cursor-text hover:bg-slate-50 rounded p-1 min-h-[1.5rem]"
        >
          {outlet.description || "Click to add description..."}
        </p>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
        <div className="flex flex-col w-full">
          <span className="text-[9px] uppercase tracking-tighter text-slate-400 font-bold mb-0.5">Assigned Date</span>
          <input 
            type="date"
            value={dateValue}
            onChange={handleDateChange}
            className="text-[10px] text-slate-600 font-medium bg-transparent border-none p-0 outline-none cursor-pointer hover:text-blue-600"
          />
        </div>
      </div>
    </div>
  );
};

export default OutletCard;
