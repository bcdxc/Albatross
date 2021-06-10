<template>
    <div class="post-topic">
        <Panel width="94%" class="my-post-panel" :height="'80px'">
            <template #head>
                <div class="top">
                    <router-link to="/dev">首页</router-link> /
                    <span>发布话题</span>
                </div>
                <div class="down">
                    <span>发布板块：客户端测试</span>
                </div>
            </template>
            <template #content>
                <div class="con">
                    <el-input
                        type="textarea"
                        :rows="1"
                        placeholder="标题字数10字以上"
                        v-model="title"
                        class="one-input"
                    >
                    </el-input>
                    <el-input
                        type="textarea"
                        :rows="21"
                        placeholder="请输入内容"
                        v-model="content"
                        class="two-input"
                    >
                    </el-input>
                    <div class="con-down">
                        <el-button @click="submit" type="primary"
                            >提交</el-button
                        >
                    </div>
                </div>
            </template>
        </Panel>
    </div>
</template>

<script>
import Panel from "../layout/Panel.vue";
export default {
    components: { Panel },
    data() {
        return {
            title: "",
            content: "",
        };
    },
    created () {
        console.log(this.$store.state.token);
    },
    methods: {
        submit() {
            this.$axios({
                method: "post",
                url: "/topics",
                params: {
                    accesstoken: this.$store.state.token,
                },
                data: {
                    title: this.title,
                    content: this.content,
                    tab: "dev",
                },
            })
                .then(() => {
                    this.title = "";
                    this.content = "";
                    this.$message({
                        showClose: true,
                        message: "话题提交成功！",
                        type: "success",
                    });
                    this.$router.back();
                })
                .catch((err) => {
                    console.log(err);
                    this.$message({
                        showClose: true,
                        message: "话题提交失败",
                        type: "error",
                    });
                });
        },
    },
};
</script>

<style lang="less">
.my-post-panel {
    .head {
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-around;
    }
    .con {
        .two-input {
            margin-top: 16px;
        }
        .con-down {
            text-align: right;
            margin-top: 16px;
        }
    }
}
</style>