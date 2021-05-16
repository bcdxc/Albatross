<template>
    <div class="topic" v-if="topic">
        <Panel width="94%" height="90px" class="my-panel">
            <template #head>
                <h2>
                    <span v-if="topic.top || topic.good" class="span-tab">{{
                        topic | formatTab
                    }}</span>
                    <span>{{ topic.title }}</span>
                </h2>
                <p class="title-down">
                    <span>发布于 {{ topic.create_at | filterMoment }}</span>
                    <span>作者 {{ topic.author.loginname }}</span>
                    <span>浏览量 {{ topic.visit_count }}</span>
                    <span
                        >最后一次回复是
                        {{ topic.last_reply_at | filterMoment }}</span
                    >
                    <span>来自 {{ topic.tab | filterTopicTab }}</span>
                    <el-button
                        type="success"
                        icon="el-icon-star-off"
                        :class="['collect', topic.is_collect ? 'active' : '']"
                        size="mini"
                        circle
                        @click="collect"
                    ></el-button>
                </p>
            </template>
            <template #content>
                <div class="con" v-html="topic.content"></div>
            </template>
        </Panel>
        <Panel class="my-two-panel" width="94%">
            <template #head>
                <h3>{{ topic.reply_count }} 回复</h3>
            </template>
            <template #content>
                <div class="con">
                    <div
                        class="con-item"
                        v-for="(item, i) in topic.replies"
                        :key="item.id"
                    >
                        <div class="con-top">
                            <div class="left">
                                <router-link to="/">
                                    <img :src="item.author.avatar_url" alt="" />
                                </router-link>
                                <router-link class="loginname" to="/">{{
                                    item.author.loginname
                                }}</router-link>
                                <span class="span-text">{{ i + 1 }}楼</span>
                                <span class="span-text">{{
                                    item.create_at | filterMoment
                                }}</span>
                            </div>
                            <div class="right">
                                <span
                                    :class="[
                                        'right-r',
                                        item.is_uped ? 'active' : '',
                                    ]"
                                >
                                    <i
                                        class="iconfont icon-zanpress"
                                        @click="zanpress(item.id)"
                                    ></i>
                                    <span>{{ item.ups.length }}</span>
                                </span>
                                <i
                                    @click="reply(i, item.author.loginname)"
                                    :class="[
                                        'iconfont',
                                        'huifu',
                                        'icon-huifu',
                                        i === choiseReply ? 'active' : '',
                                    ]"
                                ></i>
                            </div>
                        </div>
                        <p v-html="item.content"></p>
                        <div v-if="i === choiseReply" class="reply">
                            <el-input
                                type="textarea"
                                :rows="2"
                                placeholder="请输入内容"
                                v-model="textarea"
                                ref="textarea"
                            >
                            </el-input>
                            <el-button
                                class="submit"
                                type="primary"
                                @click="submit(item.id, item.author.loginname)"
                                >提 交</el-button
                            >
                        </div>
                    </div>
                    <div class="reply">
                        <el-input
                            type="textarea"
                            :rows="4"
                            placeholder="请输入回复内容"
                            v-model.trim="textareaAll"
                            @focus="textareaAllChange"
                        >
                        </el-input>
                        <el-button class="submit" @click="submit" type="primary"
                            >提 交</el-button
                        >
                    </div>
                </div>
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
                    >抱歉！您还没有登录，请登录之后进行点赞或发表评论（点击确定进入登录页面）</span
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
import moment from "moment";
export default {
    components: {
        Panel,
    },
    data() {
        return {
            topic: null,
            textarea: "",
            choiseReply: -1,
            textareaAll: "",
            dialogVisible: false,
        };
    },
    computed: {
        getToken() {
            return this.$store.state.token;
        },
    },
    created() {
        const { topicId } = this.$route.params;
        // 需要判断登录过没有，
        this.$nextTick(function () {
            // console.log(this.getToken);
            // console.log("获取token信息", this.getToken);
            this.getToken
                ? this.getTopic(topicId, this.getToken)
                : this.getTopic(topicId);
        });
    },
    methods: {
        async getTopic(topicId, accesstoken) {
            if (arguments.length === 1) {
                await this.$axios({
                    method: "get",
                    url: `/topic/${topicId}`,
                }).then((res) => {
                    this.topic = res.data;
                });
            } else {
                await this.$axios({
                    method: "get",
                    url: `/topic/${topicId}`,
                    params: {
                        accesstoken,
                    },
                }).then((res) => {
                    this.topic = res.data;
                });
            }
            // PerInfo 更新作者信息
            this.$store.commit("setOnlyUserInfoByTopic", this.topic.author);
        },
        handleClose() {
            this.dialogVisible = false;
        },
        gotoLogin() {
            this.handleClose();
            this.$router.push("/login");
        },
        reply(i, loginname) {
            if (
                this.choiseReply === -1 ||
                (this.choiseReply !== -1 && this.choiseReply !== i)
            ) {
                this.choiseReply = i;
                this.textarea = `@${loginname} `;
                this.$nextTick(function () {
                    this.$refs.textarea[0].focus();
                });
            } else {
                this.choiseReply = -1;
            }
        },
        textareaAllChange() {
            this.choiseReply = -1;
            this.textarea = "";
        },
        // 点赞
        zanpress(reply_id) {
            console.log(reply_id);
            if (this.$store.state.token) {
                this.$axios({
                    method: "post",
                    url: `/reply/${reply_id}/ups`,
                    params: {
                        accesstoken: this.getToken,
                    },
                })
                    .then((res) => {
                        // 返回的 res.action 为 up 是点赞成功，down是取消点赞
                        // 点赞之后页面更新：
                        // 方案1. 根据请求的结果 为 up 是点赞成功，down是取消点赞 去更新对应评论的 is_uped，
                        // 方案2. 重新请求一遍
                        console.log(res);
                        const targetReply = this.topic.replies.find(
                            (item) => item.id === reply_id
                        );
                        const userId = JSON.parse(
                            sessionStorage.getItem("user")
                        ).id;
                        res.action === "up"
                            ? (targetReply.is_uped = true) &&
                              targetReply.ups.push(userId)
                            : (targetReply.is_uped = false) ||
                              targetReply.ups.pop();
                        // targetReply.is_uped =
                        //     res.action === "up" ? true : false;
                        // res.action === "up"
                        //     ? targetReply.ups.push(userId)
                        //     : targetReply.ups.pop();
                    })
                    .catch((err) => {
                        console.log(err);
                        this.$message.error(
                            "不可以为自己点赞哦，把你的赞留给其他人吧"
                        );
                    });
            } else {
                // 去登陆
                this.dialogVisible = true;
            }
        },
        // 提交评论
        submitReply(loginname) {
            const userInfo = JSON.parse(sessionStorage.getItem("user"));
            const regexp = /@\w+ /;
            const replyItem = {
                author: {
                    avatar_url: userInfo.avatar_url,
                    loginname: userInfo.loginname,
                },
                content: loginname
                    ? `<div class=\"markdown-text\"><p><a href=\"/user/${
                          userInfo.loginname
                      }\">@${loginname}</a>${this.textarea.replace(
                          regexp,
                          " "
                      )} </p>\n</div>`
                    : `<div class=\"markdown-text\"><p>${this.textareaAll}</p>\n</div>`,
                create_at: moment().format(),
                id: userInfo.id,
                is_uped: false,
                reply_id: null,
                ups: [],
            };
            this.topic.replies.push(replyItem);
        },
        submit(id, loginname) {
            // const regexp = /@[\w\?%&=\-_]+/;
            const { id: topicId } = this.topic;
            if (this.$store.state.token) {
                // 判断是否登录
                if (this.choiseReply !== -1 && this.textarea.trim()) {
                    if (typeof id === "string") {
                        this.$axios({
                            method: "post",
                            url: `/topic/${topicId}/replies`,
                            params: {
                                accesstoken: this.getToken,
                                reply_id: id,
                            },
                            data: {
                                content: this.textarea,
                            },
                        })
                            .then(() => {
                                this.submitReply(loginname);
                                this.textareaAllChange();
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    }
                } else if (this.textareaAll) {
                    this.$axios({
                        method: "post",
                        url: `/topic/${topicId}/replies`,
                        params: {
                            accesstoken: this.getToken,
                        },
                        data: {
                            content: this.textareaAll.trim(),
                        },
                    })
                        .then(() => {
                            // 添加评论
                            this.submitReply();
                            this.textareaAll = "";
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            } else {
                // 去登陆
                this.dialogVisible = true;
            }
        },
        // 收藏
        collect() {
            // post /topic_collect/collect
            console.log(this.topic.id);
            console.log(this.getToken);
            this.$axios({
                method: "post",
                url: this.topic.is_collect
                    ? `/topic_collect/de_collect`
                    : `/topic_collect/collect`,
                params: {
                    accesstoken: this.getToken,
                },
                data: {
                    topic_id: this.topic.id,
                },
            })
                .then((res) => {
                    console.log(res);
                    this.topic.is_collect = !this.topic.is_collect;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
};
</script>

<style lang="less">
.my-panel {
    padding: 10px 20px;
    .head {
        flex-direction: column;
        justify-content: space-around;
        padding-bottom: 10px;
        border-bottom: 1px solid #ccc;
        h2,
        p {
            margin: 0;
        }
        h2 {
            display: flex;
            justify-content: center;
            align-items: center;
            .span-tab {
                width: 36px;
                text-align: center;
                border-radius: 3px;
                font-size: 14px;
                background-color: #ed6c46;
                color: #fff;
                height: 20px;
                line-height: 20px;
                font-weight: normal;
                margin-right: 10px;
            }
        }
        .title-down {
            font-size: 14px;
            opacity: 0.7;
            position: relative;
            width: 100%;
            text-align: center;
            // display: flex;
            // justify-content: space-around;
            span {
                margin-right: 20px;
            }
            .collect {
                font-size: 16px;
                position: absolute;
                top: -40%;
                right: 0;
            }
        }
    }
    .con {
        padding-top: 10px;
        h2,
        p {
            margin: 0;
        }
        p {
            text-indent: 32px;
            line-height: 28px;
        }
        h2 {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 10px;
        }
        h3 {
            text-align: center;
        }
        p img {
            width: 50%;
        }
    }
}
.my-two-panel {
    margin-top: 16px;
    .head {
        border-bottom: 1px solid #ddd;
    }
    h3 {
        margin: 0;
        width: 100%;
        text-align: center;
    }
    .con {
        .con-item {
            border-bottom: 1px solid #ddd;
            padding: 10px;
            margin-bottom: 10px;
            .con-top {
                display: flex;
                justify-content: space-between;
                .left {
                    display: flex;
                    align-items: center;
                    img {
                        width: 30px;
                        height: 30px;
                        border-radius: 5px;
                    }
                    .loginname {
                        font-size: 14px;
                        margin-left: 10px;
                    }
                    .span-text {
                        color: #ed6c46;
                        font-size: 12px;
                        margin-left: 8px;
                    }
                }
                .right {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 80px;
                    .right-r {
                        cursor: pointer;
                        font-size: 16px;
                        i,
                        span {
                            transition: color 0.3s;
                        }
                        &:hover {
                            i,
                            span {
                                color: #ed6c46;
                            }
                        }
                        span {
                            font-size: 14px;
                            margin-left: 3px;
                        }
                    }
                    .huifu {
                        font-size: 18px;
                        cursor: pointer;
                        transition: color 0.3s;
                        &:hover {
                            color: #ed6c46;
                        }
                    }
                }
            }
            p {
                margin: 10px 0 0;
            }
        }
        .reply {
            display: flex;
            margin-top: 10px;
            .submit {
                margin-left: 20px;
            }
        }
    }
}
.active {
    color: #ed6c46;
}
</style>
