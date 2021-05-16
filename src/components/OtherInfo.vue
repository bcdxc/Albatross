<template>
    <div class="other-info">
        <Panel :width="280" :height="0">
            <template #head> </template>
            <template #content>
                <el-button type="primary" size="small" @click="release"
                    >发布话题</el-button
                >
            </template>
        </Panel>
        <div>
            <el-dialog
                title="请登录"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose"
            >
                <span
                    >抱歉！您还没有登录，请登录之后进行话题发布（点击确定进入登录页面）</span
                >
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="gotoLogin"
                        >确 定</el-button
                    >
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import Panel from "../layout/Panel.vue";
export default {
    components: { Panel },
    data() {
        return {
            dialogVisible: false,
        };
    },
    methods: {
        release() {
            console.log(this.$route);
            // 发布话题之前需要先判断是否登录
            if (this.$store.state.token) {
                this.$router.push({ name: "PostTopic" });
            } else {
                this.dialogVisible = true;
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
.other-info {
    margin-top: 15px;
}
</style>