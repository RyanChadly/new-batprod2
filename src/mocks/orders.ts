import { dateMaker } from "../utils/utils";
import { OrderParams, RessourceType } from "../utils/types";

export const mockOrders: OrderParams[] = [
  {
    id: "1",
    startTime: JSON.stringify(dateMaker(0)),
    litres: 1,
    customer: "Du Bide",
    deadline: JSON.stringify(dateMaker(59)),
    product: {
      name: "Cream",
      cremeAmount: 1,
      milkAmount: 0,
      tasks: [
        {
          name: "Standardisation",
          ressourcesTypes: RessourceType.Tank,
          minutes: 10,
          minutesPerLitre: 3,
        },
        {
          name: "Transfer",
          ressourcesTypes: RessourceType.Pipe,
          minutes: 2,
          minutesPerLitre: 0.5,
        },
        {
          name: "Pastorisation",
          ressourcesTypes: RessourceType.Pastorisateur,
          minutes: 10,
          minutesPerLitre: 1,
        },
      ],
    },
  },
  {
    id: "2",
    startTime: JSON.stringify(dateMaker(0)),
    litres: 1,
    customer: "Du Gros",
    deadline: JSON.stringify(dateMaker(59)),
    product: {
      name: "Milk",
      cremeAmount: 0,
      milkAmount: 1,
      tasks: [
        {
          name: "Standardisation",
          ressourcesTypes: RessourceType.Tank,
          minutes: 1,
          minutesPerLitre: 3,
        },
        {
          name: "Transfer",
          ressourcesTypes: RessourceType.Pipe,
          minutes: 2,
          minutesPerLitre: 1,
        },
        {
          name: "Pastorisation",
          ressourcesTypes: RessourceType.Pastorisateur,
          minutes: 1,
          minutesPerLitre: 1,
        },
      ],
    },
  },
];
