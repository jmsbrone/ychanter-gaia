import { RxjsEventSystem } from "./rxjs-event-system";

describe("rxjs event system", () => {
    const system = new RxjsEventSystem();

    test("subscribe", () => {
        expect(
            new Promise((resolve, reject) => {
                system.subscribe("category 1", "event 1", (data: any) => {
                    resolve(data);
                });
            })
        ).resolves.toBe("test data");

        expect(
            new Promise((resolve, reject) => {
                system.subscribe("category 1", "event 2", (data: any) => {
                    resolve(data);
                });
            })
        ).resolves.toBe("test data 2");

        system.trigger("category 1", "event 1", "test data");
        system.trigger("category 1", "event 2", "test data 2");
    });

    test("unsubscribe", () => {
        let triggerCounter = 0;
        const subscription = system.subscribe("category", "event", () => {
            triggerCounter++;
        });

        system.trigger("category", "event");
        expect(triggerCounter).toBe(1);

        system.trigger("category", "event");
        expect(triggerCounter).toBe(2);

        subscription.unsubscribe();

        system.trigger('category', 'event');
        expect(triggerCounter).toBe(2);
    });
});
