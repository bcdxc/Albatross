<template>
    <div class="unread">
        <Panel width="94%" :height="40" v-loading="loading">
            <template #head>
                <div class="unread-head">
                    <el-button type="text" @click="goback">返回</el-button>
                    <span> / 未读消息：{{ unreadMes.length }}</span>
                </div>
            </template>
            <template #content>
                <ul v-if="unreadMes.length">
                    <li v-for="item in unreadMes" :key="item.id">
                        <router-link
                            :to="{
                                name: 'UserInfo',
                                params: { loginname: item.author.loginname },
                            }"
                            class="need-color"
                            >{{ item.author.loginname }}</router-link
                        >
                        <span>在话题</span>
                        <router-link
                            :to="{
                                name: 'Topic',
                                params: { topicId: item.topic.id },
                            }"
                            class="need-color"
                            >{{ item.topic.title }}</router-link
                        >
                        <span>中@了你</span>
                    </li>
                </ul>
                <p v-else>暂无</p>
            </template>
        </Panel>
        <Panel width="94%" :height="40" class="sec-panel" v-loading="loading">
            <template #head>
                <div class="unread-head">
                    <span>已读消息：{{ readMes.length }}</span>
                </div>
            </template>
            <template #content>
                <ul v-if="readMes.length">
                    <li v-for="item in readMes" :key="item.id">
                        <router-link
                            :to="{
                                name: 'UserInfo',
                                params: { loginname: item.author.loginname },
                            }"
                            class="need-color"
                            >{{ item.author.loginname }}</router-link
                        >
                        <span>在话题</span>
                        <router-link
                            :to="{
                                name: 'Topic',
                                params: { topicId: item.topic.id },
                            }"
                            class="need-color"
                            >{{ item.topic.title }}</router-link
                        >
                        <span>中@了你</span>
                    </li>
                </ul>
                <p v-else>暂无</p>
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
            unreadMes: [],
            readMes: [],
            loading: true,
        };
    },
    methods: {
        getUnread(token) {
            this.loading = true;
            this.$axios({
                method: "get",
                url: `/messages`,
                params: {
                    accesstoken: token,
                },
            }).then((res) => {
                this.unreadMes = res.data.hasnot_read_messages;
                this.readMes = res.data.has_read_messages;
                this.loading = false;
            });
        },
        goback() {
            this.$router.back();
        },
    },
    watch: {
        "$store.state.token": {
            handler(newValue) {
                if (newValue) {
                    this.getUnread(newValue);
                }
            },
            immediate: true,
        },
    },
};
</script>

<style lang="less">
.unread {
    .sec-panel {
        margin-top: 18px;
    }
    ul {
        padding: 0;
        margin-top: 0;
    }
    li {
        list-style: none;
        height: 30px;
        line-height: 30px;
        display: flex;
        span,
        a {
            margin-left: 10px;
        }
        .need-color {
            cursor: pointer;
            color: #07b7c5;
            transition: color 0.3s;
            &:hover {
                color: #0695a0;
            }
        }
    }
    .unread-head {
        span {
            font-size: 14px;
        }
    }
}
</style>