
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
  TRAINING_PENDING = "TRAINING PENDING",
  OUTLET_LIVE = "OUTLET LIVE"
}

export type City = "BANGLORE" | "Chennai" | "Pune" | "Ahmedabad" | "HYDERABAD" | "MUMBAI";

export interface Outlet {
  id: string;
  name: string;
  city: City;
  description: string;
  stage: WorkflowStage;
  timestamp: number;
}

export interface StageConfig {
  id: WorkflowStage;
  color: string;
}
