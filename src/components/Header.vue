<template>
    <header>
        <div class="head-left">
            <router-link class="logo" to="/">
                <img src="../assets/images/logo2.png" alt="" />
                <span>Albatross111</span>
            </router-link>
        </div>
        <div class="head-right" v-if="!$route.path.includes('login')">
            <router-link to="/">未读消息</router-link>
            <el-button class="head-btn" @click="signout" type="text"
                >退出</el-button
            >
        </div>
    </header>
</template>

<script>
export default {
    name: "Header",
    methods: {
        signout() {
            if (this.$store.state.userInfo) {
                this.$store.commit("clearUserInfo");
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('token');
            }
        },
    },
};
</script>

<style lang="less">
header {
    width: 100%;
    height: 50px;
    padding: 0 150px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #090909;
    color: #f5f5f7;
    user-select: none;
    a,
    .head-btn {
        color: #f5f5f7;
        opacity: 0.8;
        transition: opacity 0.3s;
        font-size: 14px;
    }
    .logo {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .logo img {
        width: 30px;
        height: 30px;
        margin-right: 10px;
    }
    a:hover,
    .head-btn:hover {
        color: #fff;
        opacity: 1;
    }
    .head-btn {
        margin-left: 20px;
    }
}
</style>