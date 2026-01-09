
import { WorkflowStage, StageConfig, Outlet } from './types';

export const STAGES: StageConfig[] = [
  { id: WorkflowStage.ONBOARDING_REQUEST, color: "bg-blue-100 border-blue-500 text-blue-700" },
  { id: WorkflowStage.OVERLAP_CHECK, color: "bg-amber-100 border-amber-500 text-amber-700" },
  { id: WorkflowStage.CHEF_APPROVAL, color: "bg-purple-100 border-purple-500 text-purple-700" },
  { id: WorkflowStage.FASSI_APPLY, color: "bg-pink-100 border-pink-500 text-pink-700" },
  { id: WorkflowStage.ID_CREATION, color: "bg-indigo-100 border-indigo-500 text-indigo-700" },
  { id: WorkflowStage.COMMISSION_UPDATE, color: "bg-cyan-100 border-cyan-500 text-cyan-700" },
  { id: WorkflowStage.MOU_SIGN, color: "bg-orange-100 border-orange-500 text-orange-700" },
  { id: WorkflowStage.LOCATION_CHANGE, color: "bg-teal-100 border-teal-500 text-teal-700" },
  { id: WorkflowStage.INTEGRATION, color: "bg-rose-100 border-rose-500 text-rose-700" },
  { id: WorkflowStage.OUTLET_LIVE, color: "bg-emerald-100 border-emerald-500 text-emerald-700" }
];

export const INITIAL_OUTLETS: Outlet[] = [
  { id: '1', name: 'Burger King - Downtown', description: 'Flagship store in the city center.', brand: 'Burger King', requestedBy: 'John Doe', stage: WorkflowStage.ONBOARDING_REQUEST, timestamp: Date.now(), priority: 'high' },
  { id: '2', name: 'Taco Bell - North', description: 'New mall location in the northern suburbs.', brand: 'Taco Bell', requestedBy: 'Jane Smith', stage: WorkflowStage.OVERLAP_CHECK, timestamp: Date.now() - 100000, priority: 'medium' },
  { id: '3', name: 'Subway - Station', description: 'High-traffic metro station outlet.', brand: 'Subway', requestedBy: 'Mike Ross', stage: WorkflowStage.CHEF_APPROVAL, timestamp: Date.now() - 200000, priority: 'low' },
  { id: '4', name: 'Pizza Hut - Mall', description: 'Renewal of existing franchise agreement.', brand: 'Pizza Hut', requestedBy: 'Harvey Specter', stage: WorkflowStage.ID_CREATION, timestamp: Date.now() - 300000, priority: 'medium' },
  { id: '5', name: 'KFC - Airport', description: 'T3 International Terminal kiosk.', brand: 'KFC', requestedBy: 'Louis Litt', stage: WorkflowStage.OUTLET_LIVE, timestamp: Date.now() - 400000, priority: 'high' },
];
