<template lang="pug">
v-layout.fill-height
    client-only
        template(#fallback)
            | loading...
        v-app-bar(color="accent", hide)
            v-app-bar-nav-icon
            v-app-bar-title Admin panel
            v-spacer
            v-btn(variant="text", :icon="$ycIcon('dots-vertical')")
        v-navigation-drawer
            v-list(nav, color="secondary")
                template(v-for="(menuGroup, code) in leftMenu.getItems()", :key="code")
                    .text-h6(v-if="menuGroup.name") {{ menuGroup.name }}
                    template(v-for="(menuItem, index) in menuGroup.items", :key="index")
                        v-list-item(nuxt, :to="menuItem.path", exact)
                            template(v-slot:prepend)
                                v-icon(:icon="$ycIcon(menuItem.icon)")
                            v-list-item-title.font-weight-bold {{ menuItem.title }}
                    v-divider
        v-main.mb-6
            v-sheet.ma-2.pa-6.rounded-lg.fill-height
                NuxtPage
            v-snackbar(
                v-model="notificationState.open",
                location="top",
                timeout="5000",
                :color="notificationState.type",
                elevation="24"
            )
                div.text-body-1
                    v-icon(:icon="$ycIcon(getIconForNotification())")
                    span.ml-2.my-auto {{ notificationState.text }}
                template(v-slot:actions)
                    v-btn(variant="plain", color="white" :icon="$ycIcon('close')", @click="closeNotification()")
            confirmation-dialog(
                v-model="confirmationDialogState.open",
                :title="confirmationDialogState.title",
                :text="confirmationDialogState.text",
                @confirm="onConformationDialogConfirm()",
                @cancel="onConformationDialogCancel()"
            )
            v-dialog(v-model="globalLoaderState.open", persistent)
                v-card.pa-6
                    v-card-title.text-center Please wait...
                    v-card-text
                        v-row(no-gutters).justify-center
                            template(v-if="globalLoaderState.indeterminate")
                                v-progress-linear(indeterminate, color="accent")
                            template(v-else)
                                v-progress-linear(
                                    :model-value="globalLoaderState.progressCurrent / globalLoaderState.progressTotal * 100",
                                    :height="25",
                                    color="accent",
                                    bg-color="secondary"
                                )
                                    template(v-slot:default="{value}")
                                        strong.text-foreground-text {{ Math.round(value) }}%
                            .text-subtitle-1.mt-1 {{ globalLoaderState.text }}
        v-footer.app-footer(app, v-show="adminFooterState.show")
            component(v-for="componentName in adminFooterState.components", :is="getComponent(componentName)")
</template>

<script setup lang="ts">
import { ComponentLoaderHelper } from "../core/helpers/component-loader";

/**
 * --------------------------------------------------------
 * Template getters
 * --------------------------------------------------------
 */

function getIconForNotification() {
    return "notification-" + notificationState.value.type;
}

function getComponent(name: string) {
    return ComponentLoaderHelper.getComponent(name);
}

/**
 * --------------------------------------------------------
 * Refs, states and watchers setup
 * --------------------------------------------------------
 */

const adminFooterState = useAdminFooterState();
const notificationState = useAppNotificationState();
const confirmationDialogState = useConfirmationDialogState();
const globalLoaderState = useGlobalLoaderState();
const leftMenu = useAdminLeftMenu();

/**
 * --------------------------------------------------------
 * User interaction handlers
 * --------------------------------------------------------
 */

function closeNotification() {
    notificationState.value.open = false;
}

async function onConformationDialogConfirm() {
    if (confirmationDialogState.value.confirmCallback) {
        await confirmationDialogState.value.confirmCallback();
    }

    confirmationDialogState.value.open = false;
}

async function onConformationDialogCancel() {
    if (confirmationDialogState.value.cancelCallback) {
        await confirmationDialogState.value.cancelCallback();
    }

    confirmationDialogState.value.open = false;
}
</script>

<style lang="scss">
.app-footer {
    box-shadow: 0 -2px 10px rgba(var(--v-theme-accent));
}
</style>
