<template>
    <header>
        <div class="head-left">
            <router-link class="logo" to="/">
                <img src="../assets/images/logo2.png" alt="" />
                <span class="title">Albatross</span>
            </router-link>
        </div>
        <div class="head-right" v-if="!$route.path.includes('login')">
            <!-- <router-link :to="{ name: 'Unread' }">未读消息</router-link> -->
            <span class="head-btn" @click="unread" type="text">未读消息</span>
            <span class="head-btn" @click="signout" type="text">退出</span>
        </div>
        <div>
            <el-dialog
                title="请登录"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose"
            >
                <span
                    >抱歉！您还没有登录，请登录之后查看未读消息（点击确认进入登录界面）</span
                >
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="gotoLogin"
                        >确 定</el-button
                    >
                </span>
            </el-dialog>
        </div>
    </header>
</template>

<script>
export default {
    name: "Header",
    data() {
        return {
            dialogVisible: false,
        };
    },
    methods: {
        signout() {
            if (this.$store.state.userInfo) {
                this.$store.commit("clearUserInfo");
                sessionStorage.removeItem("user");
                sessionStorage.removeItem("token");
            }
        },
        unread() {
            // 进入页面之前需要先判断是否登录
            if (this.$route.name !== "Unread") {
                let userInfo = JSON.parse(sessionStorage.getItem("user"));
                if (userInfo) {
                    this.$store.commit("setOnlyUserInfoByTopic", userInfo);
                    this.$router.push({ name: "Unread" });
                } else {
                    this.dialogVisible = true;
                }
            } else {
                this.$message({
                    message: "您已经在这个页面了，请不要重复点击哦",
                    type: "warning",
                });
            }
        },
        handleClose() {
            this.dialogVisible = false;
        },
        gotoLogin() {
            this.handleClose();
            this.$router.push("/login");
        },
    },
};
</script>

<style lang="less">
header {
    width: 100%;
    height: 60px;
    padding: 0 150px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // background: #090909;
    // background: #00bcd4;
    // background: #0097a7;
    // background: #8cd5d8;
    background: #5abdc1;
    user-select: none;
    .head-left {
        .title {
            color: #fff;
            font-size: 18px;
        }
    }
    .head-btn {
        color: #fff;
        opacity: 0.8;
        font-size: 16px;
        cursor: pointer;
        &:hover {
            opacity: 1;
            color: #fff;
        }
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
    .head-btn {
        margin-left: 20px;
    }
    .head-right {
        flex: 1;
        text-align: right;
    }
}
</style>