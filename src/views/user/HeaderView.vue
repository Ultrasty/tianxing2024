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
            <span class="menu-title">{{ menu.title }}</span>
            <!-- 下拉小三角SVG -->
            <span class="v-icon" :class="{ 'rotate': nav_item_selected === menu.name }"><svg width="12px" height="6px"
                viewBox="0 0 21 12" version="1.1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g transform="translate(-229.000000, -1030.000000)" fill="#1460A8" fill-rule="nonzero">
                    <g transform="translate(0.000000, 992.000000)">
                      <path
                        d="M245.490095,44.5384204 C245.503417,44.5126251 245.52501,44.4910322 245.536678,44.4643876 C245.765393,43.9886732 245.690511,43.406559 245.285521,43.0239668 L236.105052,34.3408492 C235.604391,33.8676384 234.8152,33.8900807 234.34114,34.3899362 C233.867929,34.8905964 233.889566,35.6797879 234.390227,36.1538481 L242.627627,43.9462921 L234.422638,51.8543453 C233.926985,52.3325185 233.912009,53.1217546 234.390227,53.6182572 C234.634723,53.8727226 234.961567,54 235.288411,54 C235.600278,54 235.912146,53.8835861 236.154138,53.6507136 L245.251455,44.8827444 C245.268935,44.8652645 245.275552,44.841168 245.293032,44.8228834 C245.306354,44.8104105 245.320481,44.8012458 245.333759,44.7879682 C245.404439,44.7138906 245.441857,44.6232273 245.490095,44.5384204 Z"
                        transform="translate(239.832261, 44.000000) rotate(-270.000000) translate(-239.832261, -44.000000) ">
                      </path>
                    </g>
                  </g>
                </g>
              </svg>
            </span>
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
  transition: 0.6s ease;
}

.header-container:hover {
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

.menu-title {
  text-decoration: none;
  color: #e1e1e1;
  font-weight: bold;
  padding: 15px 0;
}

.header-container:hover .menu-title {
  color: black;
}

.v-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  align-items: center;
  transition: transform 0.3s ease;
}

.v-icon svg path {
  fill: #e1e1e1;
}

.header-container:hover .v-icon svg path {
  fill: black;
}

.v-icon.rotate {
  transform: rotate(180deg);
}

.header-container:hover .v-icon.rotate svg path {
  fill: #2d8dd2;
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


.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-50%) scaleY(0);
}
</style>
