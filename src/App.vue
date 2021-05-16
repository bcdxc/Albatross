<template>
    <div id="app">
        <Header />
        <router-view class="aside" />
    </div>
</template>

<script>
import Header from "./components/Header.vue";
export default {
    components: {
        Header,
    },
    name: "app",
};
</script>

<style lang="less">
</style>
