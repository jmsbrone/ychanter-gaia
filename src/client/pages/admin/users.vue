<template lang="pug">
auth-admin-user-manager
</template>

<script lang="ts">
import _ from "client/helpers/lodash";
import { Component, Vue } from "nuxt-property-decorator";

@Component({
    layout: "admin",
})
export default class AdminUsersPage extends Vue {}
</script>
