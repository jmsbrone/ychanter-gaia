import { defineStore } from "pinia";

export const useEditorHistoryStore = defineStore({
    id: "editor-history-store",
    state: () => {
        return {
            // Editor store states. Stored as JSON due to imperfect deep cloning.
            states: [],
            currentPointer: -1,
        };
    },
    getters: {
        previousState() {
            if (this.currentPointer <= 0) {
                return null;
            }

            return JSON.parse(this.states[this.currentPointer - 1]);
        },
        nextState() {
            if (this.currentPointer === this.states.length - 1) {
                return null;
            }

            return JSON.parse(this.states[this.currentPointer + 1]);
        },
    },
    actions: {
        pushState(state: any) {
            if (this.currentPoint !== this.states.length - 1) {
                this.states = this.states.slice(0, this.currentPointer + 1);
            }
            this.states.push(JSON.stringify(state));
            this.currentPointer = this.states.length - 1;
        },
    },
});
