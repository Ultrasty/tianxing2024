<template>
  <div class="header-container" v-show="isHeaderVisible">
    <div class="header-content">
      <router-link :to="{ name: 'home' }" class="logo-container">
        <img class='logo_img' :src="logo_img" />
        <!-- 白色 logo -->
        <img class='logo_txt logo_txt_w' :src="logo_txt_w" />
        <!-- 黑色 logo -->
        <img class='logo_txt logo_txt_b' :src="logo_txt_b" />
      </router-link>
      <div class="nav-wrapper">
        <div class="nav-items">
          <div v-for="menu in menus" :key="menu.name" @mouseenter="handleMouseEnterNavItem(menu, $event)"
            @mouseleave="handleMouseLeaveNavItem" class="nav-item" :class="{ active: isActive(menu.name) }">
            <DropdownMenu :title="menu.title" :subMenus="menu.subMenus" :isVisible="nav_item_selected === menu.name"
              :style="{ left: menu.offsetLeft + 'px', zIndex: -10 }" />
            <span class="nav-link">{{ menu.title }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import logo_img from '@/assets/logo-img.png';
import logo_txt_b from '@/assets/logo-txt-b.png';
import logo_txt_w from '@/assets/logo-txt-w.png';

import DropdownMenu from '@/views/user/DropdownMenu.vue';

const isHeaderVisible = ref(true);

const menus = ref([
  {
    title: 'ENSO',
    name: 'ENSO',
    subMenus: [
      { title: '预测结果', name: 'ENSO_ForecastResult' },
      { title: '预测检验', name: 'ENSO_ForecastExamination' },
    ],
    offsetLeft: 0 // 初始化 offsetLeft
  },
  {
    title: '全球天气',
    name: 'GlobalWeather',
    subMenus: [
      { title: '预测结果', name: 'GlobalWeather_ForecastResult' },
    ],
    offsetLeft: 0 // 初始化 offsetLeft
  },
  {
    title: 'NAO',
    name: 'NAO',
    subMenus: [
      { title: '预测结果', name: 'NAO_ForecastResult' },
      { title: '预测检验', name: 'NAO_ForecastExamination' },
    ],
    offsetLeft: 0 // 初始化 offsetLeft
  },
  {
    title: '海冰',
    name: 'SeaIce',
    subMenus: [
      { title: '预测结果', name: 'SeaIce_ForecastResult' },
      { title: '预测检验', name: 'SeaIce_ForecastExamination' },
    ],
    offsetLeft: 0 // 初始化 offsetLeft
  },
]);

const nav_item_selected = ref<string | null>(null);

const handleMouseEnterNavItem = (menu: any, event: MouseEvent) => {
  const navItem = (event.target as HTMLElement).closest('.nav-item');
  if (navItem) {
    const rect = navItem.getBoundingClientRect();
    menu.offsetLeft = -rect.left; // 设置 offsetLeft 为负的 rect.left 以使 DropdownMenu 与屏幕左侧对齐
  }
  nav_item_selected.value = menu.name;
};

const handleMouseLeaveNavItem = () => {
  nav_item_selected.value = null;
};

const isActive = (menuName: string) => {
  return nav_item_selected.value === menuName;
};

</script>

<style scoped>
.header-container {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  position: fixed;
  width: 100vw;
  z-index: 5000;
   transition: 0.5s ease;
}

.header-container:hover {
  /* border-bottom: 1px solid #C9C5BC; */
  background: none;
  background-color: rgb(255, 255, 255);
}

.logo-container {
  position: relative;
  height: 40px;
  width: 800px;
  display: flex;
  align-items: center;
}

.logo_txt {
  position: absolute;
  top: 0;
  left: 100px;
  height: 100%;
  transition: opacity 0.5s ease;
}

.logo_txt_w {
  opacity: 1;
  /* 初始显示白色 */
  z-index: 1;
}

.logo_txt_b {
  opacity: 0;
  /* 初始隐藏黑色 */
  z-index: 2;
}

.header-container:hover .logo_txt_w {
  opacity: 0;
  /* hover 时隐藏白色 */
}

.header-container:hover .logo_txt_b {
  opacity: 1;
  /* hover 时显示黑色 */
}


.header-content {
  width: 100%;
  height: 70px;
  margin: 0 auto;
  display: flex;
  align-items: center;
z-index: 10;
}

.logo_img {
  height: 100%;
  margin-left: 30px;
  object-fit: cover;
  cursor: pointer;
  display: block;
}

.nav-wrapper {
  display: flex;
  width: 100%;
  align-items: center;
  height: 100%;
  position: relative;
  justify-content: center;
}

.nav-items {
  display: flex;
  width: 50%;
  gap: 20px;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.nav-item {
  flex-grow: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0 10px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  height: 4px;
  width: 0;
  background-color: transparent;
  transition: width 0.3s, background-color 0.3s;
}

.nav-item.active::after,
.nav-item:hover::after {
  width: 100%;
  background-color: #2D8DD2;
}

.nav-link {
  text-decoration: none;
  color: black;
  padding: 15px 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
}
</style>
