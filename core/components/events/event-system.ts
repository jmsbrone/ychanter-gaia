/**
 * Event system port identifier.
 */
export const EventSystemPort = "EventSystem";

/**
 * Port for event management within the system.
 */
export interface EventSystem {
    /**
     * Subscribes to the specified event.
     * @param category Event category
     * @param event Event name
     * @param callback Callback function that will be executed with event data when
     * event is triggered.
     *
     * @return Subscription identificator that can be used to unsubscribe
     */
    subscribe(category: string, event: string, callback: (data: any) => void): EventSubscription;

    /**
     * Triggers specified event with given data.
     * @param category Event category
     * @param event Event name
     * @param data Event data
     */
    trigger(category: string, event: string, data?: any): void;
}

/**
 * Interface for event subscriptions used with event system.
 */
export interface EventSubscription {
    /**
     * Unsubscribes from watched event.
     */
    unsubscribe(): void;
}
