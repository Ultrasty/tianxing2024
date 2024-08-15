<template>
    <div class="h-screen bg-cover bg-default overflow-auto"
        :style="{ backgroundImage: `url(${bg})`, '--el-color-primary': '#2D8DD2' }" @scroll="handleScroll">
        <template v-if="isLoginPage">
            <RouterView />
        </template>
        <template v-else>
            <!-- 使用 transition 实现淡入淡出效果 -->
            <transition name="fade">
                <HeaderView v-if="showHeader" />
            </transition>
            <RouterView />
            <FooterView />
        </template>
    </div>
</template>

<script lang="ts" setup>

import bg from '@/assets/bg.png';
import { provideConfig } from '@/composables/config';
import config from '@/composables/config/config.json';
import { UserModel, provideUser } from '@/composables/user';
import { computed, reactive, ref } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import FooterView from './FooterView.vue';
import HeaderView from './HeaderView.vue';

const route = useRoute();
const isLoginPage = computed(() => route.path === '/login');
const user = reactive<UserModel>({
    loggedIn: false,
});

// 用于控制 HeaderView 的显示与隐藏
const showHeader = ref(true);

// 定义 handleScroll 函数
function handleScroll(event: Event) {
    const target = event.target as HTMLElement;
    const scrollY = target.scrollTop;

    // 如果 scrollY 超过 370px，隐藏 HeaderView
    if (scrollY > 370) {
        showHeader.value = false;
    } else {
        showHeader.value = true;
    }
}
provideUser(user);
provideConfig(config);
</script>

<style scoped>
/* 定义淡入淡出的过渡效果 */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
