import ENSOForecastExamination from '@/views/ENSO/ForecastExamination.vue'
// Import SeaIce components
import SeaIce_ForecastResult from '@/views/SeaIce/ForecastResult.vue';
import SeaIce_ForecastExamination from '@/views/SeaIce/ForecastExamination.vue';

import Achievement from '@/views/About/Achievement.vue'
import UserView from '@/views/user/UserView.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory('/tianxing'),
    routes: [
        {
            name: 'home',
            path: '/',
            component: UserView,
            redirect: { name: 'about' },
            children: [ //这块跟headerview里面menus对应
                {
                    name: 'about',
                    meta: {
                        title: 'About',
                    },
                    path: 'about',
                    component: Achievement,
                },
                {
                    name: 'ENSO_ForecastExamination',
                    meta: {
                        title: 'ENSO_ForecastExamination',
                    },
                    path: 'ENSO_ForecastExamination',
                    component: ENSOForecastExamination,
                },
                {
                    name: 'SeaIce_ForecastResult',
                    meta: {
                        title: 'SeaIce Forecast Result',
                    },
                    path: 'SeaIce/ForecastResult',
                    component: SeaIce_ForecastResult,
                },
                {
                    name: 'SeaIce_ForecastExamination',
                    meta: {
                        title: 'SeaIce Forecast Examination',
                    },
                    path: 'SeaIce/ForecastExamination',
                    component: SeaIce_ForecastExamination,
                },
            ],
        },
    ],
})

export default router;
