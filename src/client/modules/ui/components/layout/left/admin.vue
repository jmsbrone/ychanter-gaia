<template lang="pug">
include ../../../templates/icons.pug

v-navigation-drawer(app, :temporary="$vuetify.breakpoint.mobile", v-model="drawer_open")
    v-list
        v-list-item(nuxt, to="/admin", exact)
            v-list-item-icon
                +icon("dashboard")
            v-list-item-content
                v-list-item-title Dashboard
        v-divider
        v-list-item(v-for="item in menu_items", nuxt, :to="item.to", exact, dense, :key="item.to")
            v-list-item-icon
                +icon_v("item.icon")
            v-list-item-content
                v-list-item-title {{ item.title }}
        v-divider
        v-list-item(nuxt, to="/admin/settings", exact)
            v-list-item-icon
                +icon("settings")
            v-list-item-content
                v-list-item-title Settings
</template>

<script lang="ts">
import { Component, Vue, Watch } from "nuxt-property-decorator";

@Component({})
export default class PageAdminLeftPanel extends Vue {
    menu_items = [
        {
            title: "Section manager",
            to: "/admin/sections",
            icon: "section_tree",
        },
        {
            title: "Content manager",
            to: "/admin/content",
            icon: "content",
        },
        {
            title: "Users",
            to: "/admin/users",
            icon: "users",
        }
    ];
    drawer_open: boolean = false;

    @Watch("drawer_open")
    onDrawerStateChange() {
        if (!this.drawer_open) {
            this.$store.commit("root/closeLeftMenu");
        }
    }

    @Watch("$store.state.root.left_menu")
    onGlobalDrawerStateChange() {
        this.drawer_open = this.$store.state.root.left_menu;
    }

    beforeMount() {
        this.drawer_open = !this.$vuetify.breakpoint.mobile;
    }
}
</script>
