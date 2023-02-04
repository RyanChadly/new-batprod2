import Order from "./classes/order-class";
import Ressource from "./classes/ressource-class";
import { getFullShortTime } from "../utils/utils";
import { OrderParams, RessourceParams } from "../utils/types";

export const simulate = (
  ordersParam: OrderParams[],
  ressourcesParam: RessourceParams[]
): { orders: OrderParams[]; ressources: RessourceParams[] } => {
  const orders: Order[] = [];
  const ressources: Ressource[] = [];
  console.log("start");
  for (let order of ordersParam) {
    orders.push(new Order(order));
  }
  for (let ressource of ressourcesParam) {
    ressources.push(new Ressource(ressource));
  }

  for (let order of orders) {
    order.simulate(ressources);
    console.table(
      order.history.map((event) => ({
        debut: getFullShortTime(event.startTime),
        fin: getFullShortTime(event.endTime),
        litres: event.litres,
        tache: event.taskName,
        litresRestants: event.remainingLitres(),
        ressource: event.ressourceName,
        id: event.id,
        cancelled: event.isCancelled,
      }))
    );
  }
  console.log("completed");
  return {
    orders: orders.map((order) => ({
      ...order,
      deadline: JSON.stringify(order.deadline),
      startTime: JSON.stringify(order.startTime),
      ressources: undefined,
    })),
    ressources,
  };
};
