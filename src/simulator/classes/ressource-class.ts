import {
  AvailabilitySlot,
  Product,
  RessourceEvent,
  RessourceEventType,
  RessourceParams,
  RessourceType,
} from "../../utils/types";

export default class Ressource {
  capacityL: number;
  type: RessourceType;
  name: string;
  parent: string[];
  child: string[];
  history: RessourceEvent[];
  canMixOrders: boolean;
  xCoord: number;
  yCoord: number;

  constructor(args: RessourceParams) {
    this.name = args.name;
    this.type = args.type;
    this.parent = args.parent;
    this.child = args.child;
    this.capacityL = args.capacityL;
    this.canMixOrders = args.canMixOrders;
    this.history = args.history ?? [];
    this.xCoord = args.xCoord;
    this.yCoord = args.yCoord;
  }

  /**
   *
   * @param product
   * @param startTime
   * @param deadline
   * @returns an array of availability slots
   */
  public checkAvailability(
    product: Product,
    startTime: Date,
    deadline: Date
  ): AvailabilitySlot[] {
    const timeStamps = this.getRelevantTimestampsFromHistory(
      startTime,
      deadline
    );

    let previousTimeStamp = startTime;
    let AvailabilityArray: AvailabilitySlot[] = [];
    timeStamps.forEach((timeStamp) => {
      if (timeStamp === startTime) return;
      const overlapingEvents = this.getOverlappingEvents(
        previousTimeStamp,
        timeStamp
      );
      const currentproduct = this.getProduct(overlapingEvents);
      const remainingCapacity =
        currentproduct === product || currentproduct === undefined
          ? this.getRemainingCapacity(overlapingEvents)
          : 0;
      AvailabilityArray.push({
        startTime: previousTimeStamp,
        endTime: timeStamp,
        capacity: remainingCapacity,
      });
      previousTimeStamp = timeStamp;
    });

    return this.mergeTimeSlots(AvailabilityArray);
  }

  private mergeTimeSlots(
    availabilityArray: AvailabilitySlot[]
  ): AvailabilitySlot[] {
    let newArr: AvailabilitySlot[] = [];

    availabilityArray.forEach((slot) => {
      const prevSlot = newArr[newArr.length - 1];
      if (
        prevSlot &&
        new Date(slot.startTime).getTime() ===
          new Date(prevSlot.endTime).getTime() &&
        slot.capacity === prevSlot.capacity
      ) {
        prevSlot.endTime = slot.endTime;
      } else {
        newArr.push(slot);
      }
    });
    return newArr;
  }

  private getRelevantTimestampsFromHistory(startTime: Date, endTime: Date) {
    const relevantHistory = this.history.filter((event) => {
      return event.endTime > startTime && event.startTime < endTime;
    });
    const allDates = relevantHistory
      .map((event) => [event.endTime, event.startTime])
      .flat();
    allDates.push(startTime);
    allDates.push(endTime);

    const uniqueTimestamps: Date[] = allDates.filter(
      (date, i, self) =>
        self.findIndex(
          (d) => new Date(d).getTime() === new Date(date).getTime()
        ) === i
    );

    return uniqueTimestamps.sort((a, b) => {
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  private getOverlappingEvents(start: Date, end: Date): RessourceEvent[] {
    return this.history.filter(
      (event) => event.startTime <= start && event.endTime >= end
    );
  }

  private getProduct(overlapingEvents: RessourceEvent[]): Product | undefined {
    return overlapingEvents[0] ? overlapingEvents[0].product : undefined;
  }

  private getRemainingCapacity(overlapingEvents: RessourceEvent[]) {
    if (!this.canMixOrders) {
      if (overlapingEvents.length > 0) return 0;
      return this.capacityL;
    }
    const sumOfLitres = overlapingEvents
      .map((ev) => ev.litres)
      .reduce((prev, curr) => prev + curr, 0);
    return this.capacityL - sumOfLitres;
  }

  public book(ressourceEvent: RessourceEvent) {
    this.history.push(ressourceEvent);
    this.history.sort((a, b) => {
      if (a.startTime > b.startTime) return 1;
      if (a.startTime < b.startTime) return -1;
      if (a.endTime > b.endTime) return 1;
      if (a.endTime < b.endTime) return -1;
      return 0;
    });
  }

  public canExtendEvent({
    eventId,
    litres,
    endTime,
  }: {
    eventId: string;
    litres: number;
    endTime: Date;
  }): boolean {
    const parentEvent = this.history.find(
      (event) =>
        event.id === eventId && event.type === RessourceEventType.Initial
    );
    if (!parentEvent)
      throw new Error(
        `Cannot find the parent event with id ${eventId} in ressource ${this.name}`
      );
    const { endTime: startTime, product } = parentEvent;
    const relevantTimestamps = this.getRelevantTimestampsFromHistory(
      startTime,
      endTime
    );
    relevantTimestamps.forEach((timeStamp, index, timestamps) => {
      const start = timeStamp;
      const end = timestamps[index + 1];
      if (timestamps[index + 1]) {
        const overlappingEvents = this.getOverlappingEvents(start, end);
        const remainingCapacity = this.getRemainingCapacity(overlappingEvents);
        const overlappingProduct = this.getProduct(overlappingEvents);
        if (remainingCapacity < this.capacityL && !this.canMixOrders)
          return false;
        if (overlappingProduct !== product) return false;
        if (remainingCapacity < litres) return false;
      }
    });
    return true;
  }

  public deleteEvent(id: string): void {
    this.history = this.history.filter(
      (event) => event.id !== id && event.childEventId !== id
    );
  }
}
