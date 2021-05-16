<template>
    <div class="per-info">
        <Panel :width="280">
            <template #head>
                <div class="head-mes">Albatross</div>
            </template>
            <template #content>
                <el-button
                    v-if="!userInfo"
                    type="primary"
                    size="small"
                    @click="login"
                    >登陆</el-button
                >
                <div class="show-mes" v-else>
                    <router-link
                        :to="{
                            name: 'UserInfo',
                            params: { loginname: userInfo.loginname },
                        }"
                    >
                        <img :src="userInfo.avatar_url" alt="" />
                    </router-link>
                    <router-link
                        :to="{
                            name: 'UserInfo',
                            params: { loginname: userInfo.loginname },
                        }"
                        >{{ userInfo.loginname }}</router-link
                    >
                </div>
            </template>
        </Panel>
    </div>
</template>

<script>
import Panel from "../layout/Panel.vue";
export default {
    components: { Panel },
    created() {
        if (!this.$store.state.userInfo) {
            let user = JSON.parse(sessionStorage.getItem("user"));
            let token = sessionStorage.getItem("token");
            this.$store.commit("setUserInfo", { user, token });
        }
    },
    computed: {
        // 刷新页面的时候 store 数据清空
        // 我们应该当第一次登录的时候 可以 将userInfo 转换成 json 串 存储到浏览器中
        // 之后刷新 在 created 中看看能不能取到 vuex 数据，不能的话直接去浏览器中取 并更新 store
        // 当点击退出按钮的时候 清空 store 以及浏览器存储的数据
        userInfo() {
            return this.$store.state.userInfo;
        },
    },
    methods: {
        login() {
            this.$router.push("/login");
        },
    },
};
</script>

<style lang='less'>
.per-info {
    .head-mes {
        color: #000;
        opacity: 0.8;
    }
    .show-mes {
        display: flex;
        align-items: center;
        img {
            width: 50px;
            height: 50px;
            margin-right: 10px;
            border-radius: 5px;
        }
        span {
            color: #000;
            opacity: 0.8;
        }
    }
}
</style>