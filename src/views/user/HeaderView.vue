<template>
    <div class="border-0 border-b-[1px] border-b-default border-solid">
        <div class="w-[1200px] h-[70px] mx-auto flex items-center">
            <RouterLink :to="{ name: 'home' }">
                <img class='w-[183px] h-full object-cover cursor-pointer block' :src="logo" />
            </RouterLink>
            <div class="flex-1 flex justify-end h-full">
                <div class="flex gap-[48px] h-full items-center">
                    <RouterLink v-for="menu in menus" :to="{ name: menu.name }" custom
                        v-slot="{ isActive, navigate, href }">
                        <div class="h-full flex items-center justify-center whitespace-nowrap relative after:bottom-0 after:absolute after:h-[4px] after:block after:content-[''] after:w-full"
                            :class="{ 'after:bg-primary font-semibold': isActive }">
                            <a class="no-underline text-black" :href="href" @click="navigate">{{ menu.title }}</a>
                        </div>
                    </RouterLink>
                    <img class="shrink-0 w-[32px] h-[32px] rounded-full cursor-pointer"
                        :src="user.loggedIn ? avatar : anonymous" @click="handleAvatarClick" />
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import anonymous from '@/assets/avatar-anonymous.png';
import avatar from '@/assets/avatar.png';
import logo from '@/assets/logo.png';
import { useUser } from '@/composables/user';
import { useRouter } from 'vue-router';

const user = useUser();
const router = useRouter();
const menus = [
    { title: 'About FAA', name: 'about' },
    { title: 'Apply', name: 'apply' },
    { title: 'News & Insights', name: 'news' },
    { title: 'Contact Us', name: 'contact' },
    { title: 'Donation', name: 'donation' },
    { title: 'NAO', name: 'nao' }, 
]
const handleAvatarClick = () => {
    if (!user.loggedIn) {
        router.push({ name: 'login' });
        return;
    }
}
</script>