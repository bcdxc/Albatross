<template>
    <div class="login">
        <div class="login-main">
            <el-input placeholder="请输入Token" v-model="token"></el-input>
            <el-button type="primary" @click="login" size="small"
                >确认</el-button
            >
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            token: "",
        };
    },
    methods: {
        login() {
            // 18fc6f57-6c78-4b2b-9c9d-bb060b98d732
            // 在登录成功之后，实际上我们需要把 登录成功的数据共享，这就需要用到 vuex
            this.$axios({
                method: "post",
                url: "/accesstoken",
                data: {
                    accesstoken: this.token,
                },
            })
                .then((res) => {
                    const temObj = res;
                    delete temObj.success;
                    this.$store.commit("setUserInfo", {
                        user: temObj,
                        token: this.token,
                    });
                    sessionStorage.setItem("user", JSON.stringify(temObj));
                    sessionStorage.setItem("token", this.token);
                    // 将 token 保存到本地 和 全局

                    this.$router.back();
                })
                .catch(() => {
                    this.$message.error("token错误！请重新输入！");
                });
        },
    },
};
</script>

<style lang='less'>
.login {
    width: 100%;
    height: calc(100vh - 50px);
    display: flex;
    justify-content: center;
    align-items: center;
    .login-main {
        width: 300px;
        height: 300px;
        display: flex;
        flex-direction: column;
        input {
            margin-bottom: 30px;
        }
    }
}
</style>