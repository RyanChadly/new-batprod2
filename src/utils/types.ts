import { OrderEvent } from "../simulator/classes/orderEvent-class";
import Ressource from "../simulator/classes/ressource-class";

export enum RessourceType {
  Pastorisateur = "Pastorisateur",
  Pipe = "Pipe",
  Tank = "Tank",
  Container = "Container",
  Outre = "Outre",
}

export interface Task {
  name: string;
  ressourcesTypes: RessourceType;
  minutes: number;
  minutesPerLitre: number;
}

export interface Product {
  name: string;
  cremeAmount: number;
  milkAmount: number;
  tasks: Task[];
}

export interface OrderParams {
  id: string;
  startTime: string;
  deadline: string;
  customer: string;
  litres: number;
  product: Product;
  history?: OrderEvent[];
}

export interface OrderEventParams {
  id: string;
  startTime: string;
  endTime: string;
  taskName: string;
  ressourceName: string;
  litres: number;
  isCancelled?: boolean;
  children?: { id: string; litres: number }[];
}

export interface RessourceParams {
  name: string;
  type: RessourceType;
  parent: string[];
  child: string[];
  capacityL: number;
  canMixOrders: boolean;
  history?: RessourceEvent[];
}

export enum RessourceEventType {
  Initial,
  Prolongation,
}

export interface RessourceEvent {
  type: RessourceEventType;
  id: string;
  startTime: Date;
  endTime: Date;
  litres: number;
  taskName?: string;
  customer?: string;
  product: Product; //product ref
  childEventId?: string;
}

export interface AvailabilityForCombinedEvent {
  combinedEvent: CombinedOrderEvent;
  ressourceAvailabilities: RessourceAvailability[];
}

export interface CombinedOrderEvent {
  commonChildren: Ressource[]; //reference
  lastEndTime: Date;
  totalLitres: number;
  parentEventsReferences?: OrderEvent[];
}

export interface RessourceAvailability {
  ressource: Ressource; //reference
  availability: AvailabilitySlot[];
}

export interface AvailabilitySlot {
  startTime: Date;
  endTime: Date;
  capacity: number;
}
