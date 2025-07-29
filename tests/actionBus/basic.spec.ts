import { describe, expect, it } from "bun:test";
import { createActionBus } from "../../src/actionBus";

describe("actionBus basic", () => {
    it("triggers basic action", (done) => {
        const promises: Promise<any>[] = [];
        const bus = createActionBus({
            sum: function(a: number) {
                return a + a;
            },
            multiply: function(a: number) {
                return a * a;
            },
            delay: function(a: number) {
                return new Promise((resolve) => {
                    setTimeout(() => resolve(a), 100);
                });
            },
        });

        bus.on("sum", ({ response }) => {
            expect(response).toBe(2);
        });

        promises.push(
            bus.invoke("sum", 1).then(({ response }) => {
                expect(response).toBe(2);
            }),
        );

        bus.on("multiply", ({ response }) => {
            expect(response).toBe(4);
        });

        bus.invoke("multiply", 2);

        bus.on("delay", ({ response }) => {
            expect(response).toBe(3);
        });

        promises.push(bus.invoke("delay", 3));

        Promise.all(promises).then(() => {
            done();
        });
    });
});
