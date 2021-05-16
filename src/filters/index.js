import Vue from 'vue'
import moment from "moment";
Vue.filter('formatTab', function (post) {
    return post.top ? '置顶' : post.good ? '精华' : post.tab === 'share' ? '分享' : post.tab === 'ask' ? '问答' : post.tab === 'job' ? '招聘' : '客户端测试'
})
Vue.filter('filterMoment', function (date) {
    moment.locale("zh-cn");
    return moment(date).startOf("minute").fromNow();
})
Vue.filter('filterTopicTab', function (tab) {
    return tab === 'share' ? '分享' : tab === 'ask' ? '问答' : tab === 'job' ? '招聘' : '客户端测试'
})