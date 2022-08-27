<template lang="pug">
v-container(fluid)
    .text-h4 Gallery manager
    v-divider
    v-list(v-if="galleries")
        v-list-item(
            v-for="gallery in galleries",
            :key="gallery.id",
            :title="gallery.name",
            :value="gallery",
            @click="$router.push(`/admin/content/gallery/${gallery.id}`)"
        )
            template(v-slot:prepend)
                div.d-flex.pr-4.align-center
                    .text-body-2.mr-2 {{gallery.image_count}}
                    v-icon(:icon="$ycIcon('gallery')")
            template(v-slot:append)
                v-btn(@click.stop)
                    v-icon(:icon="$ycIcon('delete')")
</template>

<script setup lang="ts">
import { DIContainer } from "../../../core/port-manager";
import type { GalleryAPI } from "../../../modules/files/api";

/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

definePageMeta({
    layout: "admin",
    middleware: ["auth"],
});

/**
 * --------------------------------------------------------
 * General variables
 * --------------------------------------------------------
 */

const service = DIContainer.get<GalleryAPI>("GalleryAPI");
const galleries = await service.getAll();

/**
 * --------------------------------------------------------
 * Template getters
 * --------------------------------------------------------
 */

// Functions for usage in template

/**
 * --------------------------------------------------------
 * Refs, states and watchers setup
 * --------------------------------------------------------
 */

// Defining refs, reactive objects, useState() and watch()

/**
 * --------------------------------------------------------
 * User interaction handlers
 * --------------------------------------------------------
 */

// Functions that will run in response to user interaction

/**
 * --------------------------------------------------------
 * Event handlers
 * --------------------------------------------------------
 */

// Functions that will run in response to component events
// that are not caused by the user directly

/**
 * --------------------------------------------------------
 * Exposed methods
 * --------------------------------------------------------
 */

// API methods and properties for the component that
// can be accessed from parent component
</script>
