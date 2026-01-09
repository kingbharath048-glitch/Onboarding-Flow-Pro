
import { WorkflowStage, StageConfig, Outlet, City } from './types';

export const CITIES: City[] = ["BANGLORE", "Chennai", "Pune", "Ahmedabad", "HYDERABAD", "MUMBAI"];

export const STAGES: StageConfig[] = [
  { id: WorkflowStage.ONBOARDING_REQUEST, color: "bg-blue-100 border-blue-500 text-blue-600" },
  { id: WorkflowStage.OVERLAP_CHECK, color: "bg-indigo-100 border-indigo-500 text-indigo-600" },
  { id: WorkflowStage.CHEF_APPROVAL, color: "bg-violet-100 border-violet-500 text-violet-600" },
  { id: WorkflowStage.FASSI_APPLY, color: "bg-purple-100 border-purple-500 text-purple-600" },
  { id: WorkflowStage.ID_CREATION, color: "bg-fuchsia-100 border-fuchsia-500 text-fuchsia-600" },
  { id: WorkflowStage.COMMISSION_UPDATE, color: "bg-pink-100 border-pink-500 text-pink-600" },
  { id: WorkflowStage.MOU_SIGN, color: "bg-rose-100 border-rose-500 text-rose-600" },
  { id: WorkflowStage.LOCATION_CHANGE, color: "bg-orange-100 border-orange-500 text-orange-600" },
  { id: WorkflowStage.INTEGRATION, color: "bg-amber-100 border-amber-500 text-amber-600" },
  { id: WorkflowStage.TRAINING_PENDING, color: "bg-yellow-100 border-yellow-500 text-yellow-600" },
  { id: WorkflowStage.OUTLET_LIVE, color: "bg-emerald-100 border-emerald-500 text-emerald-600" }
];

export const INITIAL_OUTLETS: Outlet[] = [
  { 
    id: '1', 
    name: 'James Wilson', 
    city: 'BANGLORE',
    description: 'Initial intake completed. Awaiting document verification.', 
    stage: WorkflowStage.ONBOARDING_REQUEST, 
    timestamp: Date.now() 
  },
  { 
    id: '2', 
    name: 'Sarah Chen', 
    city: 'Pune',
    description: 'Chef has approved the menu. Transitioning to FASSI application.', 
    stage: WorkflowStage.CHEF_APPROVAL, 
    timestamp: Date.now() - 100000 
  },
  { 
    id: '3', 
    name: 'Robert Miller', 
    city: 'Chennai',
    description: 'All systems integrated. Final training session scheduled.', 
    stage: WorkflowStage.TRAINING_PENDING, 
    timestamp: Date.now() - 200000 
  },
];
