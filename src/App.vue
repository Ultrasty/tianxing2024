<script setup lang="ts">
import { RouterView } from 'vue-router'
import axios from 'axios';

axios.defaults.baseURL='https://tianxing.tongji.edu.cn/api/'
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
