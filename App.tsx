
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { WorkflowStage, Outlet, City } from './types';
import { STAGES, INITIAL_OUTLETS, CITIES } from './constants';
import OutletCard from './components/OutletCard';

const STORAGE_KEY = 'onboarding_flow_v4_expanded_city';

const App: React.FC = () => {
  const [outlets, setOutlets] = useState<Outlet[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.filter((o: any) => Object.values(WorkflowStage).includes(o.stage));
      } catch (e) {
        return INITIAL_OUTLETS;
      }
    }
    return INITIAL_OUTLETS;
  });

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);
  const [analyticsView, setAnalyticsView] = useState<'stages' | 'cities'>('stages');
  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setIsSaving(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(outlets));
    if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = window.setTimeout(() => setIsSaving(false), 800);
  }, [outlets]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowAnalyticsModal(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Analytics Calculations
  const analytics = useMemo(() => {
    const total = outlets.length;
    const liveCount = outlets.filter(o => o.stage === WorkflowStage.OUTLET_LIVE).length;
    
    const counts = STAGES.reduce((acc, stage) => {
      acc[stage.id] = outlets.filter(o => o.stage === stage.id).length;
      return acc;
    }, {} as Record<string, number>);

    const cityCounts = CITIES.reduce((acc, city) => {
      acc[city] = outlets.filter(o => o.city === city).length;
      return acc;
    }, {} as Record<string, number>);

    const bottleneckEntry = Object.entries(counts)
      .filter(([stage]) => stage !== WorkflowStage.OUTLET_LIVE)
      .reduce((a, b) => (a[1] > b[1] ? a : b), ["None", 0]);

    const bottleneckStage = bottleneckEntry[1] > 0 ? bottleneckEntry[0] : "Clear";
    const pipelineHealth = total > 0 ? Math.round((liveCount / total) * 100) : 0;

    return { total, liveCount, bottleneckStage, pipelineHealth, counts, cityCounts };
  }, [outlets]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData('outletId', id);
  };

  const handleDrop = useCallback((e: React.DragEvent, targetStage: WorkflowStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('outletId');
    setOutlets(prev => prev.map(o => o.id === id ? { ...o, stage: targetStage } : o));
    setDraggedId(null);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleUpdateOutlet = (id: string, updates: Partial<Outlet>) => {
    setOutlets(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const handleDeleteOutlet = (id: string) => {
    if (window.confirm("Remove this entry from the onboarding pipeline?")) {
      setOutlets(prev => prev.filter(o => o.id !== id));
    }
  };

  const handleDownloadCSV = () => {
    const headers = ["Name", "City", "Stage", "Description", "Registration Date"];
    const rows = outlets.map(o => [
      `"${o.name.replace(/"/g, '""')}"`,
      `"${o.city}"`,
      `"${o.stage}"`,
      `"${o.description.replace(/"/g, '""')}"`,
      `"${new Date(o.timestamp).toISOString().split('T')[0]}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `onboarding_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addNewName = () => {
    const id = Math.random().toString(36).substr(2, 5).toUpperCase();
    const newEntry: Outlet = {
      id,
      name: `Candidate ${id}`,
      city: 'BANGLORE',
      description: 'Documentation pending for new onboarding request.',
      stage: WorkflowStage.ONBOARDING_REQUEST,
      timestamp: Date.now(),
    };
    setOutlets([newEntry, ...outlets]);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden relative">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center z-20 shadow-sm shrink-0">
        <div className="flex items-center space-x-4">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-indigo-200 shadow-lg">OB</div>
          <div>
            <h1 className="text-base font-black text-slate-900 tracking-tight leading-none">Onboarding Master Flow</h1>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Multi-Stage Pipeline</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={handleDownloadCSV}
            className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export CSV</span>
          </button>
          
          <button 
            onClick={() => setShowAnalyticsModal(true)}
            className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md shadow-slate-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Analytics</span>
          </button>
          <div className="h-6 w-px bg-slate-200 mx-2" />
          <button 
            onClick={addNewName} 
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md hover:shadow-indigo-200 active:scale-95"
          >
            + New Request
          </button>
        </div>
      </header>

      {/* Main Kanban Board Area */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 flex p-6 space-x-6 overflow-x-auto custom-scrollbar bg-slate-50/50">
          {STAGES.map((stage) => (
            <div 
              key={stage.id} 
              className="flex-shrink-0 w-[300px] flex flex-col"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="flex items-center justify-between mb-4 px-3 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${stage.color.split(' ')[0].replace('bg-', 'bg-').replace('-100', '-500')}`} />
                  <h2 className="text-[9px] font-black tracking-widest text-slate-500 uppercase truncate">{stage.id}</h2>
                </div>
              </div>

              <div className={`flex-1 rounded-2xl p-2 transition-all duration-300 ${draggedId ? 'bg-indigo-50/40 ring-2 ring-indigo-100 ring-dashed' : 'bg-transparent'}`}>
                <div className="space-y-3">
                  {outlets
                    .filter(o => o.stage === stage.id)
                    .map(outlet => (
                      <OutletCard 
                        key={outlet.id} 
                        outlet={outlet} 
                        onDragStart={handleDragStart}
                        onUpdate={handleUpdateOutlet}
                        onDelete={handleDeleteOutlet}
                      />
                    ))
                  }
                  {outlets.filter(o => o.stage === stage.id).length === 0 && !draggedId && (
                    <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Empty Stage</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* Analytics Modal Pop-up */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowAnalyticsModal(false)}
          />
          
          <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Performance Analytics</h2>
                <p className="text-xs text-slate-500 font-medium">Global pipeline insights and bottleneck detection</p>
              </div>
              <button 
                onClick={() => setShowAnalyticsModal(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Entries</p>
                  <div className="text-4xl font-black">{analytics.total}</div>
                  <div className="mt-4 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider italic">Real-time processing</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Success Rate</p>
                    <div className="text-3xl font-black text-emerald-600">{analytics.pipelineHealth}%</div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-1000" 
                      style={{ width: `${analytics.pipelineHealth}%` }} 
                    />
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                       <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.3.7l-7 7a1 1 0 01-1.4 0l-7-7A1 1 0 013 6V3z" clipRule="evenodd"></path></svg>
                       <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Current Bottleneck</p>
                    </div>
                    <div className="text-sm font-black text-indigo-900 uppercase tracking-tight leading-tight line-clamp-2">
                      {analytics.bottleneckStage}
                    </div>
                  </div>
                  <p className="text-[10px] text-indigo-400 mt-4 font-bold uppercase italic tracking-wider">Requires attention</p>
                </div>
              </div>

              {/* Distribution Grid */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                    <button 
                      onClick={() => setAnalyticsView('stages')}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${analyticsView === 'stages' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Stage Distribution
                    </button>
                    <button 
                      onClick={() => setAnalyticsView('cities')}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${analyticsView === 'cities' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      City Distribution
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
                    className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg border transition-all ${showDetailedBreakdown ? 'bg-indigo-600 text-white border-indigo-600' : 'text-indigo-600 border-indigo-100 hover:bg-indigo-50'}`}
                  >
                    {showDetailedBreakdown ? 'View Simplified' : 'View Detailed Metrics'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                  {analyticsView === 'stages' ? (
                    STAGES.map(stage => {
                      const count = analytics.counts[stage.id];
                      const percentage = analytics.total > 0 ? Math.round((count / analytics.total) * 100) : 0;
                      const colorClass = stage.color.split(' ')[0].replace('bg-', 'bg-').replace('-100', '-500');

                      return (
                        <div key={stage.id} className="relative group p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                                {stage.id}
                              </span>
                              {showDetailedBreakdown && (
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                                  {percentage}% Contribution
                                </span>
                              )}
                            </div>
                            <div className="text-lg font-black text-slate-900">{count}</div>
                          </div>
                          
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-700 ease-out ${colorClass}`} 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    CITIES.map(city => {
                      const count = analytics.cityCounts[city];
                      const percentage = analytics.total > 0 ? Math.round((count / analytics.total) * 100) : 0;

                      return (
                        <div key={city} className="relative group p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                                {city}
                              </span>
                              {showDetailedBreakdown && (
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                                  {percentage}% of Workforce
                                </span>
                              )}
                            </div>
                            <div className="text-lg font-black text-slate-900">{count}</div>
                          </div>
                          
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-700 ease-out bg-indigo-500`} 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-4 bg-slate-50/50 border-t flex justify-end">
               <button 
                onClick={() => setShowAnalyticsModal(false)}
                className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
      
      <footer className="bg-white border-t py-3 px-8 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 shrink-0">
        <div className="flex items-center space-x-3">
          <div className={`w-1.5 h-1.5 rounded-full ${isSaving ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
          <span>{isSaving ? 'Syncing...' : 'Workflow Secure'}</span>
        </div>
        <div className="flex items-center">
          <span className="tracking-[0.3em] font-black text-slate-500">LIVE</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
