<template>
    <el-container>
      <el-header class="header">
        <el-menu :default-active="activeMenu" mode="horizontal" @select="handleSelect" class="menu">
          <el-menu-item index="1">预测结果</el-menu-item>
          <el-menu-item index="2">预测检验</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
      <Result v-if="activeMenu === '1'" />
      <Examination v-if="activeMenu === '2'" />
    </el-main>
    </el-container>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import Result from '@/views/NAO/ForecastResult.vue';
  import Examination from '@/views/NAO/ForecastExamination.vue';
  const activeMenu = ref('1');
  
  const handleSelect = (key: string) => {
    activeMenu.value = key;
  };
  </script>

<style>
@import 'element-plus/theme-chalk/index.css';
</style>
  <style scoped>
  .header {
    display: flex;
    justify-content: center;
    background-color: #b3c0d1;
    padding: 0;
  }
  
  .menu {
    width: auto;
    min-width: 300px;
    display: flex;
    justify-content: center;
  }
  
  .el-menu-item {
    padding: 0 20px;
  }
  </style>