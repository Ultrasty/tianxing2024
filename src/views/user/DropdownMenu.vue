<template>
  <transition name="dropdown">
    <div v-if="isVisible" class="submenu">
      <div class="submenu-header">
        {{ title }}
      </div>
      <div class="submenu-content">
        <RouterLink v-for="subMenu in subMenus" :key="subMenu.name" :to="{ name: subMenu.name }" class="submenu-item">
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
  position: absolute;
  overflow-x: hidden;
  top: 70px;
  left: 0;
  right: 0;
  width: 100vw;
  min-height: 25vh;
  backdrop-filter: blur(10px);
  /* 背景模糊效果 */
  box-shadow: 0 8px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  z-index: 10;
  cursor: default;
  background-color: rgba(255, 255, 255, 0.784);
}

.submenu-header {
  flex: 3;
  padding: 16px;
  height: 100%;
  margin-right: 15px;
  text-align: right;
  align-self: center;
  font-size: 3rem;
  font-weight: bold;
  color: black;
}

.submenu-content {
  flex: 4;
  padding: 16px;
  align-content: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: rgba(161, 211, 255, 0.517);
}

.submenu-item {
  position: relative;
  margin-left: 8px;
  padding: 8px 4px;
  font-size: 1.1rem;
  text-decoration: none;
  color: rgb(30, 30, 30);
  transition: all 0.3s ease-in-out;
}

.submenu-item::before {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #000000;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
}

.submenu-item:hover::before {
  visibility: visible;
  width: 150px;
}

.submenu-item:hover {
  color: #000000;
  font-weight: bold;
}
</style>