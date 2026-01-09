
export enum WorkflowStage {
  ONBOARDING_REQUEST = "ONBOARDING REQUEST",
  OVERLAP_CHECK = "OVERLAP CHECK",
  CHEF_APPROVAL = "CHEF APPROVAL",
  FASSI_APPLY = "FASSI APPLY",
  ID_CREATION = "ID CREATION",
  COMMISSION_UPDATE = "COMMISSION UPDATE",
  MOU_SIGN = "MOU SIGN",
  LOCATION_CHANGE = "LOCATION CHANGE",
  INTEGRATION = "INTEGRATION",
  OUTLET_LIVE = "OUTLET LIVE"
}

export interface Outlet {
  id: string;
  name: string;
  description: string;
  brand: string;
  requestedBy: string;
  stage: WorkflowStage;
  timestamp: number;
  priority: 'low' | 'medium' | 'high';
}

export interface StageConfig {
  id: WorkflowStage;
  color: string;
}
