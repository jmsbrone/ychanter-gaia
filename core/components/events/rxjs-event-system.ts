import { Subject } from "rxjs";
import { EventSystem, EventSubscription } from "./event-system";

/**
 * Event information for triggered events.
 */
type EventInfo = { category: string; event: string; data: any };

/**
 * Event system implementation around RxJS
 */
export class RxjsEventSystem implements EventSystem {
    protected eventQueue: Subject<EventInfo>;

    public constructor() {
        this.eventQueue = new Subject<EventInfo>();
    }

    /** @inheritdoc */
    trigger(category: string, event: string, data: any = undefined): void {
        this.eventQueue.next({ category, event, data });
    }

    /** @inheritdoc */
    subscribe(category: string, event: string, callback: (data: any) => void): EventSubscription {
        return this.eventQueue.subscribe({
            next: (eventInfo: EventInfo) => {
                if (eventInfo.category === category && eventInfo.event === event) {
                    callback(eventInfo.data);
                }
            },
        });
    }
}
