import { ApplicationEventService } from "./application-event.service";
import { TimerService } from "./timer.service";

export const services: any[] = [TimerService, ApplicationEventService];

export * from "./application-event.service";
export * from "./timer.service";
