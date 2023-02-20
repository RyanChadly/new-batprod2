import { RessourceParams, RessourceType } from "../utils/types";

export const mockRessources: RessourceParams[] = [
  {
    name: "Tank1",
    type: RessourceType.Tank,
    parent: [],
    child: ["Pipe1"],
    capacityL: 1000,
    canMixOrders: true,
    xCoord: 0,
    yCoord: 0,
  },
  {
    name: "Tank2",
    type: RessourceType.Tank,
    parent: [],
    child: ["Pipe1"],
    capacityL: 1000,
    canMixOrders: true,
    xCoord: 500,
    yCoord: 0,
  },
  {
    name: "Pipe1",
    type: RessourceType.Pipe,
    parent: ["Tank1", "Tank2"],
    child: ["Pasto1"],
    capacityL: 10,
    canMixOrders: true,
    xCoord: 250,
    yCoord: 200,
  },
  {
    name: "Pasto1",
    type: RessourceType.Pastorisateur,
    parent: ["Tank1"],
    child: [],
    capacityL: 1000,
    canMixOrders: true,
    xCoord: 250,
    yCoord: 400,
  },
];
