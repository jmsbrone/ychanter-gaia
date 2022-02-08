<template lang="pug">
v-container
    div(v-if="error.statusCode === 404")
        h1 Page not found
    div(v-else-if="error.statusCode === 401 || error.statusCode === 403")
        h1 Not authorized
        auth-login-form
    div(v-else-if="error.statusCode === 400")
        h1 Client error
    div(v-else)
        h1 An error occurred
        div {{ error.message }}
</template>

<script>
export default {
    props: ["error"],
};
</script>
