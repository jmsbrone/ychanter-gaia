<template lang="pug">
include ../../../ui/templates/buttons.pug

v-container(fluid)
    v-data-table(:headers="table_headers", :items="entities")
        template(v-slot:top)
            v-toolbar(flat)
                v-toolbar-title Dynamic entities
                v-spacer
                v-divider.mx-4(vertical)
                +icon_btn("add")(@click="addNewEntity()")
        template(v-slot:item.actions="{ item }")
            +icon_btn("edit")(:to="`/admin/dynamic-entities/${item.id}`")
            +icon_btn("delete")(@click="deleteEntity(item)")
</template>

<script lang="ts">
import { DynamicEntity } from "client/modules/dynamic-entity/domains/dynamic-entity";
import { Component, Vue } from "nuxt-property-decorator";
import { DynamicEntityService } from "../../services/dynamic-entity-service";

@Component({})
export default class AdminDynamicEntityList extends Vue {
    table_headers = [
        { text: "ID", value: "id" },
        { text: "Title", value: "title" },
        { text: "Name", value: "name" },
        { text: "", value: "actions" },
    ];
    entities: DynamicEntity[] = [];

    async fetch() {
        const service = new DynamicEntityService();
        this.entities = await service.getAll();
    }

    addNewEntity() {
        this.$router.push("/admin/dynamic-entities/new");
    }

    async deleteEntity(entity: DynamicEntity) {
        const service = new DynamicEntityService();
        await service.delete({ id: entity.id });
    }
}
</script>
