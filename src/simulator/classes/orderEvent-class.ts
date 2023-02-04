import { OrderEventParams } from "../../utils/types";
import { deserializeDate } from "../../utils/utils";

export class OrderEvent {
  id: string;
  startTime: Date;
  endTime: Date;
  taskName: string;
  ressourceName: string;
  litres: number;
  children: { id: string; litres: number }[];
  isCancelled: boolean;

  constructor(args: OrderEventParams) {
    this.id = args.id;
    this.startTime = deserializeDate(args.startTime);
    this.endTime = deserializeDate(args.endTime);
    this.taskName = args.taskName;
    this.ressourceName = args.ressourceName;
    this.litres = args.litres;
    this.children = args.children ?? [];
    this.isCancelled = args.isCancelled ?? false;
  }

  public remainingLitres(): number {
    if (this.children.length === 0) return this.litres;
    return (
      this.litres - this.children.map((a) => a.litres).reduce((a, b) => a + b)
    );
  }

  /**
   * Marks the event as cancelled
   */
  public cancel(): void {
    this.isCancelled = true;
  }

  public deleteChild(id: string): void {
    this.children = this.children.filter((child) => child.id !== id);
  }
}
