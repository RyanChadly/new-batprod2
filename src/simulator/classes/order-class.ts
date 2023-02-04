import { getAllCombinations } from "../../utils/getAllCombinations";
import {
  AvailabilityForCombinedEvent,
  AvailabilitySlot,
  CombinedOrderEvent,
  OrderParams,
  Product,
  RessourceAvailability,
  RessourceEvent,
  RessourceEventType,
  Task,
} from "../../utils/types";
import {
  findRessourceByName,
  neededTimeForTask,
  deserializeDate,
} from "../../utils/utils";
import Ressource from "./ressource-class";
import { v4 as uuidv4 } from "uuid";
import { OrderEvent } from "./orderEvent-class";

export default class Order {
  constructor(args: OrderParams) {
    this.startTime = deserializeDate(args.startTime);
    this.deadline = deserializeDate(args.deadline);
    this.customer = args.customer;
    this.litres = args.litres;
    this.product = args.product;
    this.history = args.history ?? [];
    this.remainingLitres = args.litres;
    this.currentTask = args.product.tasks[0];
    this.id = args.id;
  }
  id: string;
  customer: string;
  deadline: Date;
  litres: number;
  product: Product;
  history: OrderEvent[];
  startTime: Date;
  remainingLitres: number;
  currentTask: Task;
  ressources: Ressource[] = [];

  public simulate(ressources: Ressource[]) {
    this.ressources = ressources;
    let attemptsCounter = 0;
    for (let index = 0; index < this.product.tasks.length; index++) {
      let taskIndex = index;
      let taskCompleted = false;
      let orderFailed = false;

      while (!taskCompleted && !orderFailed) {
        this.currentTask = this.product.tasks[taskIndex];
        if (this.executeCurrentTask()) {
          taskCompleted = taskIndex === index;
          taskIndex++;
        } else {
          attemptsCounter++;
          taskCompleted = false;
          taskIndex--;
          orderFailed = taskIndex < 0 || attemptsCounter > 1000;
        }
      }

      if (orderFailed) {
        break;
      }
    }
  }

  private executeCurrentTask(): boolean {
    let previousOrderEvents = this.getPreviousOrderEvents();

    const potentialRessourcesForCurrentTask =
      this.getPotentialRessourcesForCurrentTask(previousOrderEvents);

    let combinedEvents: CombinedOrderEvent[] = [];

    while (this.remainingLitres > 0 || previousOrderEvents.length > 0) {
      if (this.remainingLitres > 0) {
        combinedEvents = [
          {
            commonChildren: potentialRessourcesForCurrentTask,
            lastEndTime: this.startTime,
            totalLitres: this.remainingLitres,
          },
        ];
      } else {
        const orderEventsCombinations: OrderEvent[][] =
          getAllCombinations(previousOrderEvents);

        combinedEvents = this.combineEvents(orderEventsCombinations);
      }
      const availabilityOfPotentialRessources =
        this.getAvailabilityMapOfRessources(potentialRessourcesForCurrentTask);
      const availabilityForCombinedEvents = this.getRelativeAvailabilityMap(
        combinedEvents,
        availabilityOfPotentialRessources
      );

      const chosenEvent = this.getBiggerFirst(availabilityForCombinedEvents);

      if (chosenEvent) {
        const uuid = uuidv4();
        this.book(chosenEvent, uuid);
        this.prolongateParentEventInRessource(chosenEvent, uuid);
      } else {
        this.cleanupUnfinishedEvent();
        return false;
      }
      previousOrderEvents = this.getPreviousOrderEvents();
    }
    return true;
  }

  private cleanupUnfinishedEvent() {
    //find all the parents that still have quantity to send to next task (use the ID)
    //mark it as not doable (when seeing that this is undoable getAvailabilityMapOfRessources should lower the quantity by 100l maybe...)
    //delete the ressource parent event (use the same ID as the parents)
    this.history.forEach((event) => {
      if (event.remainingLitres() > 0) {
        event.cancel();
        this.ressources.forEach((ressource) => ressource.deleteEvent(event.id));
        this.history.forEach((e) => e.deleteChild(event.id));
      }
    });
  }

  private prolongateParentEventInRessource(
    chosenEvent: {
      combinedEvent: CombinedOrderEvent;
      ressource: Ressource;
      slot: AvailabilitySlot;
    },
    uuid: string
  ) {
    const {
      slot,
      combinedEvent: { parentEventsReferences },
    } = chosenEvent;

    if (parentEventsReferences) {
      const oneParent = parentEventsReferences.length === 1;

      parentEventsReferences.forEach((parentEventReference) => {
        const parentEvent = this.getParentEventInRessources(
          parentEventReference.id
        );
        const startTime = parentEvent.endTime;
        const endTime = slot.startTime;
        const litres = oneParent
          ? slot.capacity
          : parentEventReference.remainingLitres();
        const childEventId = uuid;
        const parentEventId = parentEvent.id;
        findRessourceByName(
          this.ressources,
          parentEventReference.ressourceName
        ).book({
          type: RessourceEventType.Prolongation,
          startTime,
          endTime,
          litres,
          id: parentEventId,
          childEventId,
          product: this.product,
        });
      });
    }
  }

  private getParentEventInRessources(id: string): RessourceEvent {
    let event: RessourceEvent | undefined;
    this.ressources.forEach((ressource) => {
      ressource.history.forEach((ev) => {
        if (ev.id === id) {
          event = ev;
        }
      });
    });
    if (event) {
      return event;
    } else {
      throw new Error(
        `Could not find the parent event with id : ${id} in ressources.`
      );
    }
  }

  private getRelativeAvailabilityMap(
    combinedOrderEvents: CombinedOrderEvent[],
    availabilityOfPotentialRessources: RessourceAvailability[]
  ): AvailabilityForCombinedEvent[] {
    return combinedOrderEvents.map((combinedEvent) => {
      const ressourceAvailabilities = combinedEvent.commonChildren.map(
        (ressource) => {
          const ressourcesAvailability = this.getAvailabilityReferenceFromName(
            ressource.name,
            availabilityOfPotentialRessources
          );
          const availability = this.getRessourcesAvailabilitiesForTask(
            ressourcesAvailability,
            combinedEvent,
            ressource
          );

          return {
            ressource,
            availability,
          };
        }
      );
      return {
        combinedEvent,
        ressourceAvailabilities,
      };
    });
  }

  private getRessourcesAvailabilitiesForTask(
    ressourcesAvailability: RessourceAvailability,
    combinedEvent: CombinedOrderEvent,
    ressource: Ressource
  ): AvailabilitySlot[] {
    const {
      lastEndTime: prevEventEndTime,
      totalLitres,
      parentEventsReferences,
    } = combinedEvent;

    const ressourceAvailabilityForTask: {
      startTime: Date;
      endTime: Date;
      capacity: number;
    }[] = [];

    ressourcesAvailability.availability.forEach((slot, index, slots) => {
      const { capacity, startTime: slotStart } = slot;
      const currentStartTime =
        slotStart < prevEventEndTime ? prevEventEndTime : slotStart;
      let testCapacity = capacity > totalLitres ? totalLitres : capacity;

      for (let i = index; i < slots.length; i++) {
        //do not consider slots finishing before the end of previous task
        if (prevEventEndTime >= slots[i].endTime) {
          break;
        }

        testCapacity =
          slots[i].capacity < testCapacity ? slots[i].capacity : testCapacity;

        const maxEndTime = slots[i].endTime;

        const realEndTime = new Date(
          currentStartTime.getTime() +
            neededTimeForTask(this.currentTask, testCapacity)
        );

        //do not split combinedEvents
        if (
          testCapacity < totalLitres &&
          parentEventsReferences &&
          parentEventsReferences.length > 1
        ) {
          break;
        }
        let availabilitySlot = {
          startTime: currentStartTime,
          endTime: realEndTime,
          capacity: testCapacity,
        };

        while (
          this.isImpossibleEvent(availabilitySlot, ressource) &&
          availabilitySlot.capacity > 0
        ) {
          availabilitySlot.capacity -= 10;
        }
        if (realEndTime <= maxEndTime && availabilitySlot.capacity > 0) {
          ressourceAvailabilityForTask.push(availabilitySlot);
          break;
        }
      }
    });
    return ressourceAvailabilityForTask;
  }

  private isImpossibleEvent(
    slot: AvailabilitySlot,
    ressource: Ressource
  ): boolean {
    return !!this.history.find(
      (event) =>
        event.isCancelled &&
        event.litres === slot.capacity &&
        event.startTime === slot.startTime &&
        event.ressourceName === ressource.name
    );
  }

  private getAvailabilityReferenceFromName(
    name: string,
    availabilityMap: RessourceAvailability[]
  ) {
    const result = availabilityMap.find(
      (availability) => availability.ressource.name === name
    );
    if (!result) throw new Error(`Could not find the ressource ${name}`);
    return result as {
      ressource: Ressource;
      availability: AvailabilitySlot[];
    };
  }

  private book(
    event: {
      combinedEvent: CombinedOrderEvent;
      ressource: Ressource;
      slot: AvailabilitySlot;
    },
    uuid: string
  ) {
    const targetRessource = event.ressource;
    const endTime = event.slot.endTime;
    const startTime = event.slot.startTime;

    targetRessource.book({
      type: RessourceEventType.Initial,
      id: uuid,
      startTime,
      endTime,
      litres: event.slot.capacity,
      taskName: this.currentTask.name,
      customer: this.customer,
      product: this.product,
    });
    this.history.push(
      new OrderEvent({
        id: uuid,
        endTime: JSON.stringify(endTime),
        startTime: JSON.stringify(startTime),
        litres: event.slot.capacity,
        taskName: this.currentTask.name,
        ressourceName: targetRessource.name,
      })
    );
    const { parentEventsReferences } = event.combinedEvent;
    if (parentEventsReferences) {
      parentEventsReferences.forEach((parentEventReference) => {
        const parentEvent = this.history.find(
          (potentialParentEvent) =>
            potentialParentEvent.id === parentEventReference.id
        );
        if (parentEvent) {
          if (parentEventsReferences.length > 1) {
            parentEvent.children.push({
              id: uuid,
              litres: parentEvent.remainingLitres(),
            });
          } else {
            parentEvent.children.push({
              id: uuid,
              litres: event.slot.capacity,
            });
          }
        }
      });
    } else {
      this.remainingLitres = this.remainingLitres - event.slot.capacity;
    }
  }

  private getBiggerFirst(availabilityMap: AvailabilityForCombinedEvent[]):
    | {
        combinedEvent: CombinedOrderEvent;
        ressource: Ressource;
        slot: AvailabilitySlot;
      }
    | undefined {
    let maxCapacity = 0;
    let earliestEndTime: Date;
    let bigger:
      | {
          combinedEvent: CombinedOrderEvent;
          ressource: Ressource;
          slot: AvailabilitySlot;
        }
      | undefined = undefined;

    availabilityMap.forEach((availabilityForCombinedEvent) => {
      const { combinedEvent } = availabilityForCombinedEvent;

      availabilityForCombinedEvent.ressourceAvailabilities.forEach(
        (ressourceAvailability) => {
          ressourceAvailability.availability.forEach((slot) => {
            if (
              this.canExtendParentEventInRessource(
                combinedEvent,
                slot.capacity,
                slot.endTime
              )
            ) {
              if (slot.capacity > maxCapacity) {
                maxCapacity = slot.capacity;
                earliestEndTime = slot.endTime;
                bigger = {
                  combinedEvent: availabilityForCombinedEvent.combinedEvent,
                  ressource: ressourceAvailability.ressource,
                  slot: slot,
                };
              }

              if (
                slot.capacity === maxCapacity &&
                slot.endTime < earliestEndTime
              ) {
                earliestEndTime = slot.endTime;
                bigger = {
                  combinedEvent: availabilityForCombinedEvent.combinedEvent,
                  ressource: ressourceAvailability.ressource,
                  slot: slot,
                };
              }
            }
          });
        }
      );
    });
    return bigger;
  }

  private canExtendParentEventInRessource(
    combinedEvent: CombinedOrderEvent,
    capacity: number,
    endTime: Date
  ): boolean {
    const { parentEventsReferences } = combinedEvent;
    if (!parentEventsReferences) return true;

    if (parentEventsReferences.length === 1) {
      const { ressourceName, id } = parentEventsReferences[0];
      return findRessourceByName(this.ressources, ressourceName).canExtendEvent(
        {
          eventId: id,
          litres: capacity,
          endTime,
        }
      );
    }
    parentEventsReferences.forEach((parentEventReference) => {
      const { ressourceName } = parentEventReference;
      if (
        !findRessourceByName(this.ressources, ressourceName).canExtendEvent({
          eventId: parentEventReference.id,
          litres: parentEventReference.remainingLitres(),
          endTime,
        })
      ) {
        return false;
      }
    });
    return true;
  }

  private combineEvents(
    orderEventsCombinations: OrderEvent[][]
  ): CombinedOrderEvent[] {
    const combinedEvents: CombinedOrderEvent[] = [];
    orderEventsCombinations.forEach((combination) => {
      const commonChildrenNames = combination
        .map((c) => {
          return findRessourceByName(this.ressources, c.ressourceName).child;
        })
        .reduce((a, b) => {
          return a.filter((child) => b.includes(child));
        });
      const commonChildren = commonChildrenNames.map((name) =>
        findRessourceByName(this.ressources, name)
      );
      const lastEndTime = combination
        .map((c) => c.endTime)
        .reduce((a, b) => (a > b ? a : b));
      const totalLitres = combination
        .map((c) => c.litres)
        .reduce((a, b) => a + b);
      if (commonChildren.length > 0) {
        combinedEvents.push({
          commonChildren,
          lastEndTime,
          totalLitres,
          parentEventsReferences: combination,
        });
      }
    });
    return combinedEvents;
  }

  private getPreviousOrderEvents(): OrderEvent[] {
    const previousTaskName = this.getPreviousTaskName();
    if (this.history.length === 0 && previousTaskName !== "starting") {
      throw new Error("Cannot find the previous orderEvents");
    }
    return this.history.filter(
      (event) =>
        event.taskName === previousTaskName && event.remainingLitres() > 0
    );
  }

  private getAvailabilityMapOfRessources(
    ressources: Ressource[]
  ): RessourceAvailability[] {
    return ressources.map((ressource) => ({
      ressource,
      availability: ressource.checkAvailability(
        this.product,
        this.startTime,
        this.deadline
      ),
    }));
  }

  private getPotentialRessourcesForCurrentTask(
    previousOrderEvents: OrderEvent[]
  ): Ressource[] {
    let potentialRessources: Ressource[] = [];
    if (previousOrderEvents.length > 0) {
      let allChildren = previousOrderEvents
        .map((e) => findRessourceByName(this.ressources, e.ressourceName).child)
        .flat();
      potentialRessources = this.ressources.filter(
        (ressource) =>
          allChildren.includes(ressource.name) &&
          ressource.type === this.currentTask.ressourcesTypes
      );
    } else {
      potentialRessources = this.ressources.filter(
        (ressource) => ressource.type === this.currentTask.ressourcesTypes
      );
    }
    const currentTaskIndex = this.product.tasks.indexOf(this.currentTask);
    const remainingTasks = this.product.tasks.slice(currentTaskIndex);

    //for a given ressource i'm checking if it can do the current task,
    //then i'm checking if it's children can do next task,
    //and if some of the children can again do the next task etc...
    potentialRessources = potentialRessources.filter((ressource) => {
      let ressourcesToEvaluate: Ressource[] = [ressource];
      let isPotential = true;
      remainingTasks.forEach((task) => {
        ressourcesToEvaluate = ressourcesToEvaluate.filter(
          (ress) => ress.type === task.ressourcesTypes
        );
        if (ressourcesToEvaluate.length) {
          ressourcesToEvaluate = ressourcesToEvaluate.flatMap((ress) =>
            ress.child.map((name) => findRessourceByName(this.ressources, name))
          );
        } else {
          isPotential = false;
        }
      });
      return isPotential;
    });
    return potentialRessources;
  }

  private getPreviousTaskName() {
    const currentIndex = this.product.tasks.indexOf(this.currentTask);

    if (currentIndex === -1) {
      throw new Error("This task is not found in the product.");
    }

    return currentIndex === 0
      ? "starting"
      : this.product.tasks[currentIndex - 1].name;
  }
}
