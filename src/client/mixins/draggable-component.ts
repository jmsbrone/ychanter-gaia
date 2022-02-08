import { Component, Vue } from "nuxt-property-decorator";

@Component({})
export class DraggableComponent extends Vue {
    _scrolling_window = false;
    _scrolling_d = 0;

    componentBlockStartDragging(event: DragEvent, id: string) {
        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.effectAllowed = "move";

        setTimeout(() => {
            this.$yc_storage.getStore().commit("editor/startDragging", id);
        }, 10);
        event.stopPropagation();
    }

    resetDrag() {
        this.$yc_storage.getStore().commit("editor/stopDragging");
    }

    componentBlockDrop(event: DragEvent, new_parent_id: string, after_id: string) {
        this.$yc_storage.getStore().commit("editor/dropDraggedBlock", {
            parent_id: new_parent_id,
            after_id: after_id,
        });
    }
}
