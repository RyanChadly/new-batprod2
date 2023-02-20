import { dateMaker } from "../../utils/utils";
import {
  RessourceEvent,
  RessourceEventType,
  RessourceParams,
  RessourceType,
} from "../../utils/types";
import { mockProducts } from "../../mocks/products";
import Ressource from "./ressource-class";

const ressourceExample: RessourceParams = {
  name: "Tank1",
  type: RessourceType.Tank,
  parent: [],
  child: ["Pipe1"],
  capacityL: 100,
  canMixOrders: true,
  xCoord: 1,
  yCoord: 1,
};

const ressourceEvent: RessourceEvent = {
  type: RessourceEventType.Initial,
  id: "1",
  startTime: new Date(2022, 11, 1, 8, 10),
  endTime: new Date(2022, 11, 1, 8, 20),
  litres: 10,
  customer: "Un mec",
  product: mockProducts[0],
};

const ressourceEvents = [ressourceEvent];

it("creates instance of ressource", () => {
  const myRessource = new Ressource(ressourceExample);
  expect(myRessource).toBeDefined();
});

describe("Test book method of ressource class", () => {
  it("books a ressource", () => {
    const myRessource = new Ressource(ressourceExample);
    ressourceEvents.forEach((event) => myRessource.book(event));
    expect(myRessource.history).toEqual(ressourceEvents);
  });

  it("orders the events after pushing them", () => {
    const myRessource = new Ressource(ressourceExample);
    const start = new Date(2022, 11, 1, 8, 10);
    const end = new Date(2022, 11, 1, 8, 20);
    const earlyStart = new Date(2022, 11, 1, 8, 9);
    const earlyEnd = new Date(2022, 11, 1, 8, 19);
    const book = (event: RessourceEvent) => myRessource.book(event);
    book({
      ...ressourceEvent,
      startTime: start,
      endTime: end,
    });
    book({
      ...ressourceEvent,
      startTime: earlyStart,
      endTime: end,
    });
    book({
      ...ressourceEvent,
      startTime: start,
      endTime: earlyEnd,
    });

    expect(myRessource.history).toStrictEqual([
      { ...ressourceEvent, startTime: earlyStart, endTime: end },
      { ...ressourceEvent, startTime: start, endTime: earlyEnd },
      { ...ressourceEvent, startTime: start, endTime: end },
    ]);
  });
});

describe("Test checkAvailability Method", () => {
  it("should show availability within start and deadline of the order", () => {
    const myRessource = new Ressource(ressourceExample);
    const startTime = new Date(2022, 11, 1, 8, 0);
    const endTime = new Date(2022, 11, 1, 8, 50);
    const availability = myRessource.checkAvailability(
      mockProducts[0],
      startTime,
      endTime
    );
    expect(availability[0].startTime).toEqual(startTime);
    expect(availability[availability.length - 1].endTime).toEqual(endTime);
  });
  it("should give as many timeslots as there are changes in the history", () => {
    const myRessource = new Ressource({ ...ressourceExample, capacityL: 100 });
    myRessource.book({
      ...ressourceEvent,
      litres: 8,
      startTime: dateMaker(5),
      endTime: dateMaker(6),
    });
    myRessource.book({
      ...ressourceEvent,
      litres: 9,
      startTime: dateMaker(6),
      endTime: dateMaker(7),
    });
    const availability = myRessource.checkAvailability(
      mockProducts[0],
      dateMaker(0),
      dateMaker(10)
    );

    expect(availability.length).toBe(4);
  });
  it("sums the volumes of litres for each timeslots (if it can mix)", () => {
    const myRessource = new Ressource({
      ...ressourceExample,
      capacityL: 100,
      canMixOrders: true,
    });
    myRessource.book({
      ...ressourceEvent,
      litres: 10,
      startTime: dateMaker(5),
      endTime: dateMaker(6),
    });
    myRessource.book({
      ...ressourceEvent,
      litres: 7,
      startTime: dateMaker(7),
      endTime: dateMaker(8),
    });
    myRessource.book({
      ...ressourceEvent,
      litres: 40,
      startTime: dateMaker(4),
      endTime: dateMaker(9),
    });
    const availability = myRessource.checkAvailability(
      mockProducts[0],
      dateMaker(0),
      dateMaker(10)
    );
    const expectedAvailability = [
      {
        startTime: dateMaker(0),
        endTime: dateMaker(4),
        capacity: 100,
      },
      {
        startTime: dateMaker(4),
        endTime: dateMaker(5),
        capacity: 60,
      },
      {
        startTime: dateMaker(5),
        endTime: dateMaker(6),
        capacity: 50,
      },
      {
        startTime: dateMaker(6),
        endTime: dateMaker(7),
        capacity: 60,
      },
      {
        startTime: dateMaker(7),
        endTime: dateMaker(8),
        capacity: 53,
      },
      {
        startTime: dateMaker(8),
        endTime: dateMaker(9),
        capacity: 60,
      },
      {
        startTime: dateMaker(9),
        endTime: dateMaker(10),
        capacity: 100,
      },
    ];
    expect(availability).toStrictEqual(expectedAvailability);
  });
  it("if it cannot mix it wont", () => {
    const myRessource = new Ressource({
      ...ressourceExample,
      capacityL: 100,
      canMixOrders: false,
    });
    myRessource.book({
      ...ressourceEvent,
      litres: 10,
      startTime: dateMaker(5),
      endTime: dateMaker(6),
    });

    const availability = myRessource.checkAvailability(
      mockProducts[0],
      dateMaker(0),
      dateMaker(10)
    );
    const expectedAvailability = [
      {
        startTime: dateMaker(0),
        endTime: dateMaker(5),
        capacity: 100,
      },
      {
        startTime: dateMaker(5),
        endTime: dateMaker(6),
        capacity: 0,
      },
      {
        startTime: dateMaker(6),
        endTime: dateMaker(10),
        capacity: 100,
      },
    ];
    expect(availability).toStrictEqual(expectedAvailability);
  });
  it("should merge adjacent slots if they have the same remaining capacity", () => {
    const myRessource = new Ressource({
      ...ressourceExample,
      capacityL: 100,
      canMixOrders: true,
    });
    myRessource.book({
      ...ressourceEvent,
      litres: 10,
      startTime: dateMaker(5),
      endTime: dateMaker(6),
    });
    myRessource.book({
      ...ressourceEvent,
      litres: 10,
      startTime: dateMaker(6),
      endTime: dateMaker(7),
    });
    myRessource.book({
      ...ressourceEvent,
      litres: 10,
      startTime: dateMaker(7),
      endTime: dateMaker(8),
    });
    const availability = myRessource.checkAvailability(
      mockProducts[0],
      dateMaker(0),
      dateMaker(10)
    );

    expect(availability).toStrictEqual([
      {
        startTime: dateMaker(0),
        endTime: dateMaker(5),
        capacity: 100,
      },
      {
        startTime: dateMaker(5),
        endTime: dateMaker(8),
        capacity: 90,
      },
      {
        startTime: dateMaker(8),
        endTime: dateMaker(10),
        capacity: 100,
      },
    ]);
  });
  it("does not mix different products", () => {
    const myRessource = new Ressource({
      ...ressourceExample,
      capacityL: 100,
      canMixOrders: true,
    });
    myRessource.book({
      ...ressourceEvent,
      product: mockProducts[0],
      litres: 10,
      startTime: dateMaker(5),
      endTime: dateMaker(6),
    });
    const availability = myRessource.checkAvailability(
      mockProducts[1],
      dateMaker(0),
      dateMaker(10)
    );
    expect(availability).toStrictEqual([
      {
        startTime: dateMaker(0),
        endTime: dateMaker(5),
        capacity: 100,
      },
      {
        startTime: dateMaker(5),
        endTime: dateMaker(6),
        capacity: 0,
      },
      {
        startTime: dateMaker(6),
        endTime: dateMaker(10),
        capacity: 100,
      },
    ]);
  });
});

describe("testing public method canExtendEvent", () => {
  it("Throws an error if there is no parent event", () => {
    const myRessource = new Ressource(ressourceExample);
    const myFunction = () =>
      myRessource.canExtendEvent({
        eventId: "1",
        litres: 10,
        endTime: dateMaker(0),
      });
    expect(myFunction).toThrowError(
      "Cannot find the parent event with id 1 in ressource Tank1"
    );
  });
  it("returns true if the parent can extend", () => {
    const myRessource = new Ressource({ ...ressourceExample, capacityL: 10 });
    myRessource.book({
      ...ressourceEvent,
      id: "1",
      product: mockProducts[0],
      litres: 10,
      startTime: dateMaker(5),
      endTime: dateMaker(6),
    });
    const canExtendEvent = myRessource.canExtendEvent({
      eventId: "1",
      litres: 3,
      endTime: dateMaker(8),
    });
    expect(canExtendEvent).toBeTruthy();
  });

  describe("Public method deleteEventId", () => {
    it("should delete multiple elements with same id or childEventId", () => {
      const myRessource = new Ressource({
        ...ressourceExample,
      });

      [
        ["1", "1"],
        ["2", "1"],
        ["2", "1"],
        ["3", "1"],
        ["2", "1"],
        ["5", "1"],
        ["6", "2"],
        ["7", "2"],
      ].forEach((index) =>
        myRessource.book({
          ...ressourceEvent,
          id: index[0],
          childEventId: index[1],
        })
      );

      myRessource.deleteEvent("2");
      const expectedResult = [
        ["1", "1"],
        ["3", "1"],
        ["5", "1"],
      ].map((index) => ({
        ...ressourceEvent,
        id: index[0],
        childEventId: index[1],
      }));
      expect(myRessource.history).toStrictEqual(expectedResult);
    });
  });
});
