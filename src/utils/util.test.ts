import Ressource from "../simulator/classes/ressource-class";
import { mockRessources } from "../mocks/ressources";
import { RessourceType } from "./types";
import {
  dateMaker,
  findRessourceByName,
  getFullShortTime,
  getTimeDiffMilliSec,
  neededTimeForTask,
} from "./utils";

describe("getFullShortTime", () => {
  it("translate to a local date string", () => {
    expect(getFullShortTime(dateMaker(0))).toBe("1 déc. 2022, 08:00:00");
  });
});

describe("dateMaker", () => {
  it("creates a Date with only the number of minutes as a variant", () => {
    const minutes = 10;
    expect(dateMaker(minutes)).toBeInstanceOf(Date);
    expect(dateMaker(minutes).getMinutes()).toBe(minutes);
  });
});

describe("find ressource by Name", () => {
  const ressources = mockRessources.map(
    (ressourceParams) => new Ressource(ressourceParams)
  );
  it("throws an error if the ressource  does not exist", () => {
    const searchInexistingRessource = () => {
      return findRessourceByName(ressources, "thatDoesNotExist");
    };
    expect(searchInexistingRessource).toThrowError(
      "The ressource thatDoesNotExist could not be found."
    );
  });
  it("finds the ressource by name", () => {
    expect(findRessourceByName(ressources, "Tank1")).toBeInstanceOf(Ressource);
    expect(findRessourceByName(ressources, "Tank1").name).toBe("Tank1");
  });
});

describe("needed time for task", () => {
  it("provide accurate time in milliseconds", () => {
    expect(
      neededTimeForTask(
        {
          name: "theTask",
          ressourcesTypes: RessourceType.Pastorisateur,
          minutes: 1,
          minutesPerLitre: 1,
        },
        1
      )
    ).toBe(120000);
  });
});

describe("Get Time Diff Milliseconds", () => {
  it("should provide the absolute difference in milliseconds between two dates", () => {
    expect(getTimeDiffMilliSec(dateMaker(0), dateMaker(1))).toBe(60000);
    expect(getTimeDiffMilliSec(dateMaker(1), dateMaker(0))).toBe(60000);
  });
});
