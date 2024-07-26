import AboutView from '@/views/about/AboutView.vue'
import ApplyView from '@/views/apply/ApplyView.vue'
import ContactView from '@/views/contact/ContactView.vue'
import DonationView from '@/views/donation/DonationView.vue'
import LoginView from '@/views/login/LoginView.vue'
import nao from '@/views/NAO/nao.vue'

import NewsDetailView from '@/views/news/NewsDetailView.vue'
import NewsView from '@/views/news/NewsView.vue'
import UserView from '@/views/user/UserView.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory('/faa'),
    routes: [
        {
            name: 'home',
            path: '/',
            component: UserView,
            redirect: { name: 'about' },
            children: [
                {
                    name: 'about',
                    meta: {
                        title: 'About',
                    },
                    path: 'about',
                    component: AboutView,
                },
                {
                    name: 'apply',
                    meta: {
                        title: 'Apply',
                    },
                    path: 'apply',
                    component: ApplyView,
                },
                {
                    name: 'news',
                    meta: {
                        title: 'News & Insights',
                    },
                    path: 'news',
                    component: NewsView,
                },
                {
                    name: 'newsDetail',
                    meta: {
                        title: 'News & Insights',
                    },
                    path: 'news/:id',
                    component: NewsDetailView,
                },
                {
                    name: 'contact',
                    meta: {
                        title: 'Contact Us',
                    },
                    path: 'contact',
                    component: ContactView,
                },
                {
                    name: 'donation',
                    meta: {
                        title: 'Donation',
                    },
                    path: 'donation',
                    component: DonationView,
                },
                {
                    name: 'nao',
                    meta: {
                        title: 'NAO',
                    },
                    path: 'nao',
                    component:nao,
                },
            ],
        },
        {
            name: 'login',
            path: '/login',
            component: LoginView,
        },
    ],
})

export default router