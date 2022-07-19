<template lang="pug">
component(:is="component", :options="options")
</template>

<script setup lang="ts">
import _ from "lodash";
import { ComponentLoaderHelper } from "../../core/helpers/component-loader";
import type { ComponentOptions } from "../../core/types/editor";

/**
 * --------------------------------------------------------
 * Component definitions
 * --------------------------------------------------------
 */

const props = defineProps<{
    name: string;
    options: ComponentOptions;
}>();

/**
 * --------------------------------------------------------
 * General variables
 * --------------------------------------------------------
 */

const component = ComponentLoaderHelper.getComponent(props.name);

/**
 * --------------------------------------------------------
 * Refs, states and watchers setup
 * --------------------------------------------------------
 */

const options = ref(props.options);
</script>
