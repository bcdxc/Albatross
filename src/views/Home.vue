<template>
    <div class="home">
        <div class="main-left">
            <Panel width="94%" v-if="isTopic">
                <template #head>
                    <div class="nav">
                        <router-link
                            :class="{
                                'router-link-exact-active': isHomeActive,
                            }"
                            to="/all"
                            >首页</router-link
                        >
                        <router-link to="/good">精华</router-link>
                        <router-link to="/share">分享</router-link>
                        <router-link to="/ask">问答</router-link>
                        <router-link to="/job">招聘</router-link>
                        <router-link to="/dev">客户端测试</router-link>
                    </div>
                </template>
                <template #content>
                    <div v-if="posts.length" class="con">
                        <!-- 判断是必须要加的，不然一开始 可能会因为 下面的 posts 循环 而报错 -->
                        <div
                            class="content-item"
                            v-for="post in posts"
                            :key="post.id"
                        >
                            <div class="item-left">
                                <router-link
                                    class="a-avatar"
                                    :to="{
                                        name: 'UserInfo',
                                        params: {
                                            loginname: post.author.loginname,
                                        },
                                    }"
                                >
                                    <img
                                        class="avatar"
                                        :src="post.author.avatar_url"
                                        alt=""
                                        :title="post.author.loginname"
                                    />
                                </router-link>

                                <span class="span-text">
                                    <span>{{ post.reply_count }}</span>
                                    <span class="small-text"
                                        >/{{ post.visit_count }}</span
                                    >
                                </span>
                                <span
                                    v-if="
                                        !currentTab ||
                                        post.top ||
                                        post.good ||
                                        currentTab === 'all'
                                    "
                                    :class="[
                                        'span-tab',
                                        post.top || post.good
                                            ? 'active-bg'
                                            : '',
                                    ]"
                                    >{{ post | formatTab }}</span
                                >
                                <router-link
                                    class="title"
                                    :to="{
                                        name: 'Topic',
                                        params: { topicId: post.id },
                                    }"
                                    >{{ post.title }}</router-link
                                >
                            </div>
                            <div class="item-right">
                                <span>{{
                                    post.last_reply_at | filterMoment
                                }}</span>
                            </div>
                        </div>
                    </div>
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="400"
                        :page-size="40"
                        :current-page.sync="page"
                        @current-change="changePage"
                    >
                    </el-pagination>
                </template>
            </Panel>
            <!-- <router-view v-else-if="isTopic === 'Topic' || isTopic === 'PostTopic'" /> -->
            <router-view v-else />
        </div>
        <div class="main-right">
            <PerInfo />
            <OtherInfo
                v-if="$route.name !== 'Topic' && $route.name !== 'PostTopic'"
            />
        </div>
    </div>
</template>

<script>
import Panel from "../layout/Panel.vue";
import PerInfo from "../components/PerInfo";
import OtherInfo from "../components/OtherInfo.vue";
export default {
    name: "Home",
    components: {
        Panel,
        PerInfo,
        OtherInfo,
    },
    data() {
        return {
            posts: [],
            page: 1,
        };
    },
    computed: {
        currentTab() {
            return this.$route.params.tab;
        },
        isHomeActive() {
            return this.$route.params.tab ? false : true;
        },
        isTopic() {
            const topicName = this.$route.name;
            return (
                topicName !== "Topic" &&
                topicName !== "PostTopic" &&
                topicName !== "UserInfo"
            );
        },
    },
    // created() {
    //     // this.$axios.get("/topics?page=1&limit=40").then((res) => {
    //     //     console.log(res.data);
    //     //     this.posts = res.data;
    //     // });
    //     const queryTab = this.$route.params.tab;
    //     const page = Number(this.$route.query.page);
    //     if (queryTab) {
    //         this.$axios({
    //             method: "get",
    //             url: `/topics?page=${page}&limit=40&tab=${queryTab}`,
    //         }).then((res) => {
    //             this.posts = res.data;
    //             this.page = page;
    //         });
    //     }
    // },
    watch: {
        "$route.params.tab": {
            // 因为我们要根据 nav 来切换不同的 数据，而上面用的 create 不会因为切换而重复执行，因为组件并没有销毁，所以我们要通过watch 路由的 动态参数，根据它的不同来 获取不同的数据。而需要注意的是，在nav为首页的时候，我们给的路径为 \ ，它并没有动态路由参数，所以此时取到的 tab 为 undefined。
            handler(newValue) {
                // 如果 newValue 为 undefined 的话，说明此时在首页，我们应当只返回40条数据，如果不为undefined的话，就返回要查询的 tab
                // if (!this.$route.params.tab) {
                // }
                this.page = 1;
                const tab = newValue ? `&tab=${newValue}` : "";
                this.getPostsByPage(tab);
                // this.$axios({
                //     method: "get",
                //     url: `/topics?page=1&limit=40${tab}`,
                // }).then((res) => {
                //     // console.log(res.data);
                //     this.posts = res.data;
                // });
            },
            immediate: true,
        },
        $route(newValue) {
            if (newValue.path === "/") {
                this.getPostsByPage("");
            }
            if (!newValue.path.includes("topic")) {
                this.$store.commit(
                    "setOnlyUserInfoByTopic",
                    JSON.parse(sessionStorage.getItem("user"))
                );
            }
        },
    },

    // filters: {
    //     filterMoment: function (date) {
    //         moment.locale("zh-cn");
    //         return moment(date).startOf("day").fromNow();
    //     },
    // },
    beforeRouteUpdate(to, from, next) {
        // 在当前路由改变，但是该组件被复用时调用
        // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
        // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
        // 可以访问组件实例 `this`
        this.posts = [];
        next();
    },
    methods: {
        getPostsByPage(tab) {
            this.$axios({
                method: "get",
                url: `/topics?page=${this.page}&limit=40${tab}`,
            }).then((res) => {
                // console.log(res.data);
                this.posts = res.data;
            });
        },
        changePage() {
            // 页码改变触发该事件
            const currentTab = this.$route.params.tab;
            const tab = currentTab ? `&tab=${currentTab}` : "all";
            this.getPostsByPage(tab);
            // const currentTab = this.$route.params.tab;
            // const tab = currentTab ? currentTab : "all";
            // this.$router.push(this.$route.path + `?page=${this.page}`);
            // this.getPostsByPage(tab);
        },
    },
};
</script>

<style lang="less">
.home {
    width: 100%;
    padding: 20px 120px 0;
    display: flex;
    justify-content: space-between;
    .main-left {
        width: 78%;
    }
}
.nav {
    padding: 0 5px;
    a {
        color: #000;
        padding: 2px;
        opacity: 0.6;
        margin-right: 20px;
        transition: opacity 0.3s;
        &:hover {
            opacity: 1;
            color: #ed6c46;
        }
    }
    .router-link-exact-active {
        opacity: 1;
        color: #ed6c46;
    }
}
.content-item {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    padding: 5px 8px;
    .item-left {
        display: flex;
        align-items: center;
        width: 90%;
        .a-avatar {
            opacity: 1;
        }
        .avatar {
            width: 40px;
            border-radius: 4px;
            height: 40px;
            margin: 4px 0;
        }
        .title {
            // 定宽 -- 强制不换行 -- 溢出隐藏 -- 溢出文字变点
            width: 65%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-left: 10px;
        }
        .span-text {
            width: 60px;
            margin-left: 10px;
            font-size: 14px;
            color: #ed6c46;
            .small-text {
                font-size: 12px;
                color: #000;
            }
        }
        .span-tab {
            width: 30px;
            text-align: center;
            margin-left: 10px;
            font-size: 12px;
            border-radius: 2px;
        }
        a {
            color: #000;
            opacity: 0.7;
            transition: opacity 0.3s;
            &:hover {
                opacity: 1;
            }
        }
        .active-bg {
            background-color: #ed6c46;
            color: #f9f7f1;
        }
    }
    .item-right {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #000;
        opacity: 0.7;
    }
}
</style>