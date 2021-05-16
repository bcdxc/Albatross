<template>
    <div class="user-info" v-if="userInfo">
        <Panel class="one-panel" width="94%">
            <template #head>
                <div>
                    <router-link to="/">首页 / </router-link>
                </div>
            </template>
            <template #content>
                <div class="con">
                    <div class="my-info">
                        <img :src="userInfo.avatar_url" alt="" />
                        <span>{{ userInfo.loginname }}</span>
                    </div>
                    <div class="my-other-info">
                        <span>积分：{{ userInfo.score }}</span>
                        <span>github: @{{ userInfo.githubUsername }}</span>
                        <span
                            >注册时间：{{
                                userInfo.create_at | filterMoment
                            }}</span
                        >
                    </div>
                </div>
            </template>
        </Panel>
        <Panel class="two-panel" width="94%">
            <template #head>
                <div>
                    <span>最近创建的话题</span>
                </div>
            </template>
            <template #content>
                <div class="con">
                    <div
                        class="con-item"
                        v-for="item in userInfo.recent_topics"
                        :key="item.id"
                    >
                        <p>
                            <span class="first-span">
                                <router-link
                                    :to="{
                                        name: 'UserInfo',
                                        params: {
                                            loginname: item.author.loginname,
                                        },
                                    }"
                                >
                                    <img :src="item.author.avatar_url" alt="" />
                                </router-link>
                                <router-link
                                    class="title"
                                    :to="{
                                        name: 'Topic',
                                        params: { topicId: item.id },
                                    }"
                                    >{{ item.title }}</router-link
                                >
                            </span>
                            <span class="time">{{
                                item.last_reply_at | filterMoment
                            }}</span>
                        </p>
                    </div>
                </div>
            </template>
        </Panel>
        <Panel class="three-panel" width="94%">
            <template #head>
                <div>
                    <span>最近参与的话题</span>
                </div>
            </template>
            <template #content>
                <div class="con">
                    <div
                        class="con-item"
                        v-for="item in userInfo.recent_replies"
                        :key="item.id"
                    >
                        <p>
                            <span class="first-span">
                                <router-link
                                    :to="{
                                        name: 'UserInfo',
                                        params: {
                                            loginname: item.author.loginname,
                                        },
                                    }"
                                >
                                    <img :src="item.author.avatar_url" alt="" />
                                </router-link>
                                <router-link
                                    class="title"
                                    :to="{
                                        name: 'Topic',
                                        params: { topicId: item.id },
                                    }"
                                    >{{ item.title }}</router-link
                                >
                            </span>
                            <span class="time">{{
                                item.last_reply_at | filterMoment
                            }}</span>
                        </p>
                    </div>
                </div>
            </template>
        </Panel>
    </div>
</template>

<script>
import Panel from "../layout/Panel";
export default {
    components: {
        Panel,
    },
    data() {
        return {
            userInfo: null,
        };
    },
    watch: {
        // "$store.state.userInfo": {
        //     handler(newValue) {
        //         if (newValue) {
        //             this.getUserInfo();
        //         }
        //     },
        //     immediate: true,
        // },
        "$route.params.loginname": {
            handler(newValue) {
                this.getUserInfo(newValue);
            },
            immediate: true,
        },
    },
    computed: {
        getUser() {
            return this.$route.params.loginname;
        },
    },
    methods: {
        getUserInfo(loginname) {
            this.$axios({
                method: "get",
                url: `/user/${loginname}`,
            }).then((res) => {
                this.userInfo = res.data;
                this.$store.commit("setOnlyUserInfoByTopic", {
                    loginname: res.data.loginname,
                    avatar_url: res.data.avatar_url,
                });
            });
        },
    },
};
</script>

<style lang="less">
.user-info {
    .content {
        border-top: 1px solid #ddd;
    }
}
.one-panel {
    .con {
        .my-info {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            img {
                width: 50px;
                height: 50px;
                border-radius: 5px;
            }
            span {
                margin-left: 10px;
                font-size: 18px;
            }
        }
        .my-other-info {
            display: flex;
            flex-direction: column;
            span {
                margin: 8px 0;
            }
        }
    }
}
.two-panel,
.three-panel {
    margin-top: 16px;
    .con {
        .con-item {
            p {
                height: 45px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 0 5px;
                border-bottom: 1px solid #eee;
                .first-span {
                    display: flex;
                    align-items: center;
                    a {
                        margin-right: 10px;
                    }
                    img {
                        width: 30px;
                        height: 30px;
                        border-radius: 4px;
                    }
                    .title {
                        margin-left: 10px;
                    }
                }
                .time {
                    opacity: 0.7;
                    margin-right: 15px;
                }
            }
        }
    }
}
</style>