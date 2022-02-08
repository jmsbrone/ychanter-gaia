<template lang="pug">
client-only
    v-app
        layout-top-admin
        layout-left-admin
        v-main
            v-container(fluid)
                v-sheet(rounded="lg", min-height="50vh")
                    Nuxt
        v-footer
</template>

<script>
export default {
    name: "admin",
    head: {
        title: "Admin",
    },
};
</script>
