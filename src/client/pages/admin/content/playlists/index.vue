<template lang="pug">
include ../../../../modules/ui/templates/icons.pug

div
    v-btn(@click.stop="triggerDialog")
        div
            +icon("add")
            | New playlist
    v-data-table(
        v-if="!$vuetify.breakpoint.mobile",
        :items="playlists",
        :headers="table_headers",
        :hide-default-footer="true",
        :page="page",
        :items-per-page="page_size"
    )
        template(v-slot:item.controls="{ item }")
            +icon_btn("list")(
                nuxt,
                :to="`/admin/content/playlists/${item.id}`"
            )
            +icon_btn("delete")(@click="deletePlaylist(item)")
        template(v-slot:item.created_at="{ item }")
            span {{ formatDate(item.created_at) }}
    v-list(v-else)
        div(v-for="playlist in playlists", :key="playlist.id")
            v-list-item
                v-list-item-avatar
                    +icon("images")
                v-list-item-content {{ playlist.name || '&lt;no name&gt;' }}
                v-list-item-action
                    +icon_btn_transparent("list")(
                        nuxt,
                        :to="`/admin/content/playlists/${gallery.id}`"
                    )
            v-divider
    v-pagination(v-if="pageCount > 1", v-model="page", :length="pageCount")

    v-dialog(v-model="showAddPlaylistDialog", max-width="500px")
        v-card(flat)
        v-card-title New playlist
        v-card-text
            Form(:field_config="formConfig", v-model="playlistData", ref="form")
        v-card-actions
            v-spacer
            v-btn(color="primary", @click="confirm()") Save
            v-btn(color="secondary", @click="cancel()") Close
            v-spacer
</template>

<script lang="ts">
import { DateFormatter } from "common/lib/date-formatter";
import { Component, Vue, Watch } from "nuxt-property-decorator";
import { PlaylistService } from "client/modules/file/services/playlist-service";
import { Playlist } from "client/modules/file/types/playlist";
import { FormConfig } from "../../../../types/editor";
import { FieldType } from "../../../../../common/core/types/field-type-enum";
import Form from "../../../../modules/ui/components/form.vue";
import { CreatePlaylistDto } from "../../../../modules/file/dto/playlist";

@Component({})
export default class AdminContentGalleries extends Vue {
    playlists: Playlist[] = [];
    table_headers = [
        { text: "ID", value: "id", sortable: true },
        { text: "Created", value: "created_at", sortable: false },
        { text: "Name", value: "name", sortable: true },
        { text: "Controls", value: "controls", sortable: false },
    ];
    page: number = 1;
    page_size: number = 15;
    formConfig: FormConfig = {
        name: {
            type: FieldType.string,
            name: "name",
            required: true,
        },
    };
    showAddPlaylistDialog: boolean = false;
    playlistData: any = {};
    service: PlaylistService = new PlaylistService();

    async fetch() {
        const gallery_service = new PlaylistService();
        this.playlists = await gallery_service.getAll();
    }

    formatDate(date: string) {
        return DateFormatter.toShortLocalDateTime(date);
    }

    async deletePlaylist(playlist: Playlist) {
        const gallery_service = new PlaylistService();
        await gallery_service.delete({ id: playlist.id });
        this.playlists.splice(this.playlists.indexOf(playlist), 1);
    }

    get pageCount() {
        return Math.ceil(this.playlists.length / this.page_size);
    }

    triggerDialog() {
        this.showAddPlaylistDialog = true;
    }

    async confirm() {
        if ((this.$refs["form"] as any).isValid()) {
            this.showAddPlaylistDialog = false;
            let createPlaylistDto = new CreatePlaylistDto();
            createPlaylistDto.name = this.playlistData.name;
            let playlist =  await this.service.save(createPlaylistDto);
            this.playlists.push(playlist);
            (this.$refs["form"] as Form)?.reset()
        }
    }

    async cancel() {
        this.showAddPlaylistDialog = false;
    }
}
</script>
