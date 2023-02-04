import { Product, RessourceType } from "../utils/types";

export const mockProducts: Product[] = [
  {
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
  {
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
];
