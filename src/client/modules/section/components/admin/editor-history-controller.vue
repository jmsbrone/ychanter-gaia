<template lang="pug">
include ../../../ui/templates/icons.pug

div
    v-btn.history-control-icon(variant="secondary", :disabled="history_pointer === 0", @click="undo()")
        +icon("undo")
    v-btn.history-control-icon(
        variant="secondary",
        :disabled="history_pointer === history.length - 1",
        @click="redo()"
    )
        +icon("redo")
</template>

<script lang="ts">
import { StoreState } from "client/core/components/store/state";
import _ from "client/helpers/lodash";
import { Component, Vue } from "nuxt-property-decorator";

@Component({})
export default class EditorHistoryController extends Vue {
    history: any[] = [];
    history_pointer: number = 0;
    watched_mutations: string[] = [
        "editor/addBlock",
        "editor/updateBlock",
        "editor/deleteBlock",
        "editor/setSection",
        "editor/dropDraggedBlock",
    ];
    editor_history_props: string[] = ["_blocks", "_tree", "files"];

    /**
     * Creates new record to keep in history
     */
    createHistoryRecordFromState(state: Object): Object {
        let record: Object = {};
        _.each(this.editor_history_props, (prop) => {
            record[prop] = _.cloneDeep(state["editor"][prop]);
        });

        return record;
    }

    /**
     * Creates new state from given record index
     */
    createStateFromHistoryRecord(index: number): StoreState {
        let state = _.cloneDeep(this.$yc_storage.getStore().getState());
        let prev_editor_state = this.history[index];
        _.each(this.editor_history_props, (prop) => {
            state.editor[prop] = _.cloneDeep(prev_editor_state[prop]);
        });

        return state;
    }

    beforeMount() {
        if (this.$yc_storage.getStore().hasModule("editor")) {
            this.$yc_storage.getStore().subscribe((mutation, state) => {
                if (_.includes(this.watched_mutations, mutation.type)) {
                    if (mutation.type === "editor/setSection") {
                        this.history = [];
                    } else {
                        this.history.splice(this.history_pointer + 1);
                    }
                    this.history.push(this.createHistoryRecordFromState(state));
                    this.history_pointer = this.history.length - 1;
                }
            });
            this.history.push(this.createHistoryRecordFromState(this.$yc_storage.getStore().getState()));
        }
    }

    undo() {
        if (this.history_pointer > 0) {
            this.history_pointer--;
            this.updateState();
        }
    }

    redo() {
        if (this.history_pointer < this.history.length - 1) {
            this.history_pointer++;
            this.updateState();
        }
    }

    updateState() {
        const store = this.$yc_storage.getStore();
        store.replaceState(this.createStateFromHistoryRecord(this.history_pointer));
        store.commit("editor/timeTravel");
    }
}
</script>

<style lang="scss">
@use "~assets/styles/themes/index.scss" as theme;

@each $theme in theme.$themes {
    .theme-#{$theme} {
        .history-control-icon {
            display: inline-block;
            color: theme.getTextColor($theme);
            padding: 5px;
        }
    }
}
</style>
