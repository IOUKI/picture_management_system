import { createRouter, createWebHistory } from "vue-router"

const routes = [
    {
        path: '/',
        name: 'main',
        component: () => import('@/views/Main.vue'),
        meta: {
            title: '主頁'
        }
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('@/views/PicControl.vue'),
        meta: {
            title: '管理'
        }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})

export default router