
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { WorkflowStage, Outlet } from './types';
import { STAGES, INITIAL_OUTLETS } from './constants';
import OutletCard from './components/OutletCard';

const STORAGE_KEY = 'cloudchef_flow_data';

const App: React.FC = () => {
  // Initialize state from local storage or defaults
  const [outlets, setOutlets] = useState<Outlet[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load saved data", e);
        return INITIAL_OUTLETS;
      }
    }
    return INITIAL_OUTLETS;
  });

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<number | null>(null);

  // Auto-save whenever outlets change
  useEffect(() => {
    setIsSaving(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(outlets));
    
    // Clear previous timeout and show "Saved" after a brief delay
    if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = window.setTimeout(() => {
      setIsSaving(false);
    }, 800);
  }, [outlets]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData('outletId', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = useCallback((e: React.DragEvent, targetStage: WorkflowStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('outletId');
    
    setOutlets(prev => prev.map(o => 
      o.id === id ? { ...o, stage: targetStage } : o
    ));
    setDraggedId(null);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleUpdateOutlet = (id: string, updates: Partial<Outlet>) => {
    setOutlets(prev => prev.map(o => 
      o.id === id ? { ...o, ...updates } : o
    ));
  };

  const addRandomOutlet = () => {
    const id = Math.random().toString(36).substr(2, 5).toUpperCase();
    const newOutlet: Outlet = {
      id,
      name: `New Outlet ${id}`,
      description: 'Enter specific details about this onboarding request.',
      brand: 'General',
      requestedBy: 'Admin',
      stage: WorkflowStage.ONBOARDING_REQUEST,
      timestamp: Date.now(),
      priority: Math.random() > 0.5 ? 'high' : 'medium'
    };
    setOutlets([...outlets, newOutlet]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            OP
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none tracking-tight">Onboarding Pipeline</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Management Console</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1">
             <div className="flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
               {outlets.filter(o => o.stage === WorkflowStage.OUTLET_LIVE).length} Live
             </div>
             <div className="flex items-center px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full text-[10px] font-bold uppercase tracking-wider">
               {outlets.length} Total
             </div>
          </div>
          <button 
            onClick={addRandomOutlet}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center shadow-lg active:scale-95"
          >
            <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Outlet
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-x-auto p-6 space-x-6 custom-scrollbar">
        {STAGES.map((stage) => (
          <div 
            key={stage.id} 
            className="kanban-column flex flex-col h-full"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className={`flex items-center justify-between mb-4 p-3 rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden`}>
              <div className="flex items-center space-x-2 overflow-hidden">
                <div className={`w-1.5 h-6 rounded-full ${stage.color.split(' ')[2].replace('text-', 'bg-')}`} />
                <h2 className="text-[10px] font-black tracking-widest uppercase truncate text-slate-700">{stage.id}</h2>
              </div>
              <span className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-[10px] font-black text-slate-400">
                {outlets.filter(o => o.stage === stage.id).length}
              </span>
            </div>

            <div className={`flex-1 rounded-2xl p-2 transition-all duration-300 min-h-[500px] ${draggedId ? 'bg-blue-50/50 ring-2 ring-blue-200 ring-dashed' : 'bg-transparent'}`}>
              <div className="space-y-4">
                {outlets
                  .filter(o => o.stage === stage.id)
                  .map(outlet => (
                    <OutletCard 
                      key={outlet.id} 
                      outlet={outlet} 
                      onDragStart={handleDragStart}
                      onUpdate={handleUpdateOutlet}
                    />
                  ))
                }
              </div>
            </div>
          </div>
        ))}
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-3 px-6 text-[9px] font-bold uppercase tracking-widest text-slate-400 flex justify-between items-center">
        <p>Operational Workflow Interface • v3.1</p>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {isSaving ? (
              <span className="flex items-center text-blue-500">
                <svg className="animate-spin h-3 w-3 mr-1" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Auto-saving...
              </span>
            ) : (
              <span className="text-emerald-500 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                Changes Saved Locally
              </span>
            )}
          </div>
          <p>Drag to Reassign • Click to Edit • Persistence Active</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
