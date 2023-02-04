import { mockOrders } from "../../mocks/orders";
import { mockProducts } from "../../mocks/products";
import { mockRessources } from "../../mocks/ressources";
import Order from "./order-class";
import Ressource from "./ressource-class";

describe("Order class", () => {
  it("create an instance of order", () => {
    const order = new Order({
      id: "1",
      customer: "",
      startTime: JSON.stringify(new Date()),
      deadline: JSON.stringify(new Date()),
      litres: 1,
      product: mockProducts[0],
    });
    expect(order).toBeInstanceOf(Order);
  });
  it("should simulate", () => {
    const orders: Order[] = [];
    const ressources: Ressource[] = [];
    for (let order of mockOrders) {
      orders.push(new Order(order));
    }
    for (let ressource of mockRessources) {
      ressources.push(new Ressource(ressource));
    }
    for (let order of orders) {
      order.simulate(ressources);
    }
  });
});
