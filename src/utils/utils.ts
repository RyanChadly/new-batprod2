import Ressource from "../simulator/classes/ressource-class";
import { Task } from "./types";

const fullShort: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  second: "2-digit",
  minute: "2-digit",
  hour: "2-digit",
};

const timeShort: Intl.DateTimeFormatOptions = {
  second: "2-digit",
  minute: "2-digit",
  hour: "2-digit",
};

export const getFullShortTime = (date: Date) =>
  date.toLocaleDateString(new Intl.Locale("fr-FR"), fullShort);

export const getShortTime = (date: Date) =>
  date.toLocaleTimeString(new Intl.Locale("fr-FR"), timeShort);

export const dateMaker = (minutes: number) => new Date(2022, 11, 1, 8, minutes);

export const findRessourceByName = (
  ressources: Ressource[],
  name: string
): Ressource => {
  const result = ressources.find((ressource) => ressource.name === name);
  if (!result) throw new Error(`The ressource ${name} could not be found.`);
  return result;
};

export const neededTimeForTask = (task: Task, litres: number) => {
  return (task.minutes + task.minutesPerLitre * litres) * 60 * 1000;
};

export const getTimeDiffMilliSec = (date1: Date, date2: Date) => {
  return Math.abs(date1.getTime() - date2.getTime());
};

export const deserializeDate = (stringDate: string): Date =>
  new Date(JSON.parse(stringDate));
