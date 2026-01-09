
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, City } from '../types';
import { CITIES } from '../constants';

interface OutletCardProps {
  outlet: Outlet;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onUpdate: (id: string, updates: Partial<Outlet>) => void;
  onDelete: (id: string) => void;
}

const OutletCard: React.FC<OutletCardProps> = ({ outlet, onDragStart, onUpdate, onDelete }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);

  const [localName, setLocalName] = useState(outlet.name);
  const [localDesc, setLocalDesc] = useState(outlet.description);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingName) nameInputRef.current?.focus();
    if (isEditingDesc) descInputRef.current?.focus();
    if (isEditingDate) dateInputRef.current?.focus();
  }, [isEditingName, isEditingDesc, isEditingDate]);

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
    setIsEditingDate(false);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(outlet.id, { city: e.target.value as City });
  };

  const dateValue = new Date(outlet.timestamp).toISOString().split('T')[0];

  return (
    <div
      draggable={!(isEditingName || isEditingDesc || isEditingDate)}
      onDragStart={(e) => onDragStart(e, outlet.id)}
      className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 transition-all cursor-grab active:cursor-grabbing group relative"
    >
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center">
          <select 
            value={outlet.city}
            onChange={handleCityChange}
            className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded cursor-pointer border-none outline-none hover:bg-slate-200 transition-colors"
          >
            {CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(outlet.id); }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {isEditingName ? (
        <input
          ref={nameInputRef}
          className="w-full font-bold text-slate-800 mb-2 border-b-2 border-indigo-500 outline-none bg-indigo-50/30 px-1 rounded-t"
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          onBlur={handleNameBlur}
          onKeyDown={(e) => e.key === 'Enter' && handleNameBlur()}
        />
      ) : (
        <h3 
          onClick={() => setIsEditingName(true)}
          className="font-bold text-slate-800 mb-1 group-hover:text-indigo-600 cursor-text transition-colors"
        >
          {outlet.name}
        </h3>
      )}

      <div className="space-y-1.5 mb-3">
        {isEditingDesc ? (
          <textarea
            ref={descInputRef}
            className="w-full text-xs text-slate-600 p-1.5 border border-indigo-200 rounded-lg outline-none bg-indigo-50/20 min-h-[60px] resize-none"
            value={localDesc}
            onChange={(e) => setLocalDesc(e.target.value)}
            onBlur={handleDescBlur}
          />
        ) : (
          <p 
            onClick={() => setIsEditingDesc(true)}
            className="text-xs text-slate-500 line-clamp-2 cursor-text hover:bg-slate-50 rounded p-1 -ml-1 transition-colors"
          >
            {outlet.description || "Click to add description..."}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
        <div className="flex flex-col flex-1">
          <span className="text-[8px] uppercase font-black text-slate-400 tracking-wider">Registration Date</span>
          {isEditingDate ? (
            <input
              ref={dateInputRef}
              type="date"
              className="text-[10px] text-indigo-600 font-bold outline-none border-b border-indigo-500 bg-transparent"
              value={dateValue}
              onChange={handleDateChange}
              onBlur={() => setIsEditingDate(false)}
            />
          ) : (
            <span 
              onClick={() => setIsEditingDate(true)}
              className="text-[10px] text-slate-600 font-bold cursor-pointer hover:text-indigo-600 transition-colors"
            >
              {dateValue}
            </span>
          )}
        </div>
        <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0 ml-2">
           <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
           </svg>
        </div>
      </div>
    </div>
  );
};

export default OutletCard;
