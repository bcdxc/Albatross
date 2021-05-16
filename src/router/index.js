import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    component: Home,
    children: [
      {
        path: 'topic/:topicId',
        name: 'Topic',
        component: () => import('../views/Topic.vue')
      },
      {
        path: 'postTopic',
        name: 'PostTopic',
        component: () => import('../views/PostTopic.vue')
      },
      {
        path: 'user/:loginname',
        name: 'UserInfo',
        component: () => import('../views/UserInfo.vue')
      },
    ]
  },
  {
    path: '/:tab',
    component: Home
  },
  // {
  //   path: '/topic/:topicId',
  //   name: 'Topic',
  //   component: () => import('../views/Topic.vue')
  // }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
