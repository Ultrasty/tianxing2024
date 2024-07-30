<template>
    <transition name="dropdown">
        <div v-if="isVisible" class="submenu">
            <div class="submenu-header">
                {{ title }}
            </div>
            <div class="submenu-content">
                <RouterLink v-for="subMenu in subMenus" :key="subMenu.name" :to="{ name: subMenu.name }"
                    class="submenu-item">
                    {{ subMenu.title }}
                </RouterLink>
            </div>
        </div>
    </transition>
</template>

<script lang="ts" setup>

interface SubMenu {
    title: string;
    name: string;
}

const props = defineProps<{
    title: string;
    subMenus: SubMenu[];
    isVisible: boolean;
}>();
</script>

<style scoped>
.submenu {
    position: fixed;
    top: 70px;
    left: 0;
    width: 100vw;
    /* 副菜单高一点好看 */
    height: 30vh;
    background-color: rgb(237, 236, 236);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    z-index: 10;
}

.submenu-header {
    margin-left: 25%;
    width: 25%;
    padding: 16px;
    font-size: 1.25rem;
    font-weight: bold;
    color: black;
}

.submenu-content {
    width: 75%;
    padding: 16px;
    display: flex;
    flex-direction: column;
}

.submenu-item {
    padding: 8px 0;
    text-decoration: none;
    color: black;
}

.submenu-item:hover {
    background-color: rgba(128, 128, 128, 0.1);
}
</style>