import { RessourceParams, RessourceType } from "../utils/types";

export const mockRessources: RessourceParams[] = [
  {
    name: "Tank1",
    type: RessourceType.Tank,
    parent: [],
    child: ["Pipe1"],
    capacityL: 1000,
    canMixOrders: true,
  },
  {
    name: "Tank2",
    type: RessourceType.Tank,
    parent: [],
    child: ["Pipe1"],
    capacityL: 1000,
    canMixOrders: true,
  },
  {
    name: "Pipe1",
    type: RessourceType.Pipe,
    parent: ["Tank1", "Tank2"],
    child: ["Pasto1"],
    capacityL: 10,
    canMixOrders: true,
  },
  {
    name: "Pasto1",
    type: RessourceType.Pastorisateur,
    parent: ["Tank1"],
    child: [],
    capacityL: 1000,
    canMixOrders: true,
  },
];
