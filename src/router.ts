import { createRouter, createWebHashHistory } from 'vue-router'
import TrafficLightVue from './components/TrafficLight.vue'

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/:light(red|yellow|green)?',
            component: TrafficLightVue,
        },
        {
            path: '/:p+',
            redirect: '/',
        },
    ],
})
