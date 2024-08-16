<script setup>
import { ref, onMounted, reactive, watch, defineExpose, computed } from "vue";
import * as echarts from "echarts";
import axios from 'axios';
import VChart from 'vue-echarts';
import { nextTick } from "vue";
import { configProviderContextKey } from "element-plus";

import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import bannerImg from '@/assets/nao.jpg';//首页图
import ImmersivePicture from "../user/ImmersivePicture.vue";

const selectedNAOI = ref(true)
const selectedSLP = ref(false)
//新加入
const chartSelected = ref(0);
const chartNames = ['指数预测', '模态预测'];

const selectedDate = ref(new Date('2015-1'));

const NAOISelectedYear = computed(() => selectedDate.value.getFullYear());
const NAOISelectedMonth = computed(() => selectedDate.value.getMonth() + 1);

const SLPSelectedYear = computed(() => selectedDate.value.getFullYear());
const SLPSelectedMonth = computed(() => selectedDate.value.getMonth() + 1);

//用于NAOI和SLP的初始化
let NAOIStartYear = 0;
let NAOIStartMonth = 0;
let NAOIEndYear = 0;
let NAOIEndMonth = 0;

let SLPStartYear = 0;
let SLPStartMonth = 0;
let SLPEndYear = 0;
let SLPEndMonth = 0;

const NAOIChartTitle = ref('')
const SLPChartTitle = ref('')

const NAOIOption = ref({})
const NAOIDescription = ref('')
//const SLPDescription = ref('')

const imgSrc = ref([]);
const imgIndex = ref(0);

//是否正在加载图表
const NAOILoading = ref(false);
const SLPLoading = ref(false);

//换成新的选项卡
function selectChart(index) {
  chartSelected.value = index;
  selectedNAOI.value = index === 0;
  selectedSLP.value = index === 1;
  if (selectedNAOI.value) {
    updateNAOIChart();
  } else {
    updateSLPChart();
  }
}

const moveBoxLeft = computed(() => {
  return chartSelected.value * 250;
});

const movBoxStyle = computed(() => ({
  position: "absolute",
  bottom: "0px",
  left: `${moveBoxLeft.value}px`,
  height: "2px",
  width: "125px",
  transform: "translateX(50%)",
  backgroundColor: "rgb(143,178,201)",
  transition: "left 0.3s ease"
}));

// 请求NAOI数据
const updateNAOIChart = async () => {
  //使元素失焦
  document.activeElement.blur();

  NAOILoading.value = true;
  updateNAOIChartTitle();
  const params = {
    year: Number(NAOISelectedYear.value),
    month: Number(NAOISelectedMonth.value)
  };
  axios.get('/nao/predictionResult/nao', { params })
    .then(response => {
      NAOIOption.value = response.data.option;
      NAOIDescription.value = response.data.description;
      NAOILoading.value = false;
    })
    .catch(error => {
      console.error(error);
      NAOILoading.value = false;
    });
}

// 请求SLP数据
const updateSLPChart = async () => {
  //使元素失焦
  document.activeElement.blur();

  SLPLoading.value = true;
  updateSLPChartTitle();
  const params = {
    year: Number(SLPSelectedYear.value),
    month: Number(SLPSelectedMonth.value)
  };
  axios.get('/nao/findGridData/nao', { params })
    .then(response => {
      imgSrc.value = response.data;
      // SLPDescription.value = response.data.description; // 接口未提供描述
      imgIndex.value = 0;
      loadImg(imgSrc.value);
      SLPLoading.value = false;
    })
    .catch(error => {
      console.error(error);
      SLPLoading.value = false;
    });
}

// 初始化NAOI图表
const initNAOIChart = () => {
  updateNAOIChartTitle();
  NAOILoading.value = true;
  axios.get('/nao/initialize/naoPrediction')
    .then(response => {
      NAOIStartYear = response.data.start_year;
      NAOIStartMonth = response.data.start_month;
      NAOIEndYear = response.data.end_year;
      NAOIEndMonth = response.data.end_month;
      selectedDate.value = new Date(NAOIEndYear, NAOIEndMonth);
      NAOIOption.value = response.data.option;
      NAOIDescription.value = response.data.description;
      updateNAOIChartTitle();
      NAOILoading.value = false;
    })
    .catch(error => {
      console.error(error);
      NAOILoading.value = false;
    });
}

// 初始化SLP图表
const initSLPChart = () => {
  updateSLPChartTitle();
  SLPLoading.value = true;
  axios.get('/nao/initialize/naoGrid')
    .then(response => {
      SLPStartYear = response.data.start_year;
      SLPStartMonth = response.data.start_month;
      SLPEndYear = response.data.end_year;
      SLPEndMonth = response.data.end_month;
      imgSrc.value = response.data.data;
      // SLPDescription.value = response.data.description; // 接口未提供描述
      updateSLPChartTitle();
      loadImg(imgSrc.value);
      SLPLoading.value = false;
    })
    .catch(error => {
      console.error(error);
      SLPLoading.value = false;
    });
}

function updateNAOIChartTitle() {
  let year1 = NAOISelectedYear.value;
  let month1 = NAOISelectedMonth.value;
  let year2 = '';
  let month2 = '';
  if (Number(month1) > 7) {
    month2 = Number(month1) - 7 + '';
    year2 = Number(year1) + 1 + '';
  }
  else {
    month2 = Number(month1) + 5 + '';
    year2 = year1;
  }
  if (month2.length == 1) {
    month2 = '0' + month2;
  }
  NAOIChartTitle.value = year1 + '年' + month1 + '月~' + year2 + '年' + month2 + '月 NAO预测结果';
}

function updateSLPChartTitle() {
  SLPChartTitle.value = SLPSelectedYear.value + '年' + SLPSelectedMonth.value + '月 北大西洋SLP预测结果';
}

function NAOIDisabledYear(day) {
  const year = day.getFullYear();
  if (year < NAOIStartYear || year > NAOIEndYear)
    return true;
  else
    return false;
}

function NAOIDisabledMonth(day) {
  const month = day.getMonth() + 1;
  if (NAOISelectedYear.value == NAOIStartYear && month < NAOIStartMonth)
    return true;
  else if (NAOISelectedYear.value == NAOIEndYear && month > NAOIEndMonth)
    return true;
  else
    return false;
}

function SLPDisabledYear(day) {
  const year = day.getFullYear();
  if (year < SLPStartYear || year > SLPEndYear)
    return true;
  else
    return false;
}

function SLPDisabledMonth(day) {
  const month = day.getMonth() + 1;
  if (SLPSelectedYear.value == SLPStartYear && month < SLPStartMonth)
    return true;
  else if (SLPSelectedYear.value == SLPEndYear && month > SLPEndMonth)
    return true;
  else
    return false;
}

/* 使el-button点击后能正常失焦 Start */
const buttonLeft = ref(null);
const buttonRight = ref(null);

const changeIndex = (direction) => {
  if (direction == 'left') { // 点击了左按钮
    if (imgIndex.value == 0)
      imgIndex.value = imgSrc.value.length - 1;
    else
      imgIndex.value--;
    buttonLeft.value.$el.blur(); // 使左按钮失焦
  }
  else { // 点击了右按钮
    if (imgIndex.value == imgSrc.value.length - 1)
      imgIndex.value = 0;
    else
      imgIndex.value++;
    buttonRight.value.$el.blur(); // 使右按钮失焦
  }
};

defineExpose({
  changeIndex
});
/* 使el-button点击后能正常失焦 End */

// 图片预加载
const loadImg = (imgList) => {
  for (let i = 0; i < imgList.length; i++) {
    let img = new Image();
    let currentSrc = '';
    img.src = 'http://tianxing.tongji.edu.cn' + imgList[i];
    img.onload = function () {
      console.log('加载完毕', this.currentSrc);
    }
    img.onerror = function () {
      console.log('加载错误', this.currentSrc);
    }
  }
}

onMounted(
  () => {
    initNAOIChart();
    initSLPChart();
  }
)
</script>

<template>
  <div class="pageContent">
    <div class="banner">
      <img :src="bannerImg" />
      <h3 class="title">NAO预测结果</h3>
    </div>

    <!-- <h1 v-show="selectedNAOI" class="title">
      {{ NAOIChartTitle }}
    </h1>
    <h1 v-show="selectedSLP" class="title">
      {{ SLPSelectedYear }}年{{ SLPSelectedMonth }}月 北大西洋SLP预测结果
    </h1> -->
    <div class="menu-container">
      <ul class="menu">
        <div :style="movBoxStyle" class="mov-box"></div>
        <li v-for="(chartName, index) of chartNames" :key="chartName" @click="selectChart(index)"
          :class="{ 'chart-name-selected': chartSelected === index }">
          <p>{{ chartName }}</p>
        </li>
      </ul>
    </div>


    <div style="margin: 0px 10%;">

      <div class="datePickerContainer">
        <el-date-picker @change="updateNAOIChart" v-if="selectedNAOI" type="month" v-model="selectedDate"
          :clearable="false" :disabled-date="NAOIDisabledYear" />
        <el-date-picker @change="updateSLPChart" v-if="selectedSLP" type="month" v-model="selectedDate"
          :clearable="false" :disabled-date="SLPDisabledYear" />
      </div>

      <div class="text-container" v-if="chartSelected === 0">
        <div class="description">
          {{ NAOIDescription }}
        </div>
      </div>
    </div>

    <div>
      <p></p>
    </div>

    <div class="chart-selector" v-if="chartSelected === 0">
      <v-chart class="NAOIChart" :option="NAOIOption" autoresize />
    </div>

    <div class="chart-selector" v-else-if="chartSelected === 1">
      <h3 v-show="!SLPLoading" style="text-align: center; margin-top: 0px; margin-bottom: 15px">{{ SLPChartTitle }}</h3>
      <h4 v-show="!SLPLoading" style="text-align: center; margin-top: 0px; margin-bottom: 15px; font-size: 16px">({{
        imgIndex + 1 }}/{{ imgSrc.length }})</h4>
      <div class="imgContainer">
        <immersive-picture v-if="imgSrc.length" :src="'http://tianxing.tongji.edu.cn' + imgSrc[imgIndex]" />
      </div>
      <el-button ref="buttonLeft" type="primary" class="arrowLeft" :icon="ArrowLeft"
        @click="changeIndex('left')"></el-button>
      <el-button ref="buttonRight" type="primary" class="arrowRight" :icon="ArrowRight"
        @click="changeIndex('right')"></el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  font-family: 'STXinwei';
  font-weight: 300; //调整字体粗细
  text-align: center;
  font-size: 55px;
  margin-left: 20%;
  letter-spacing: 1px;
  /* 字符间距 */
  z-index: 1;
  /* 确保图片在文字下方 */
  //color:black
  color: rgb(54, 52, 51);
  color: rgb(19, 24, 36);

}

.NAOIChart {
  height: 500px;
  background-color: white;
  /* 圆角 */
  border-radius: 8px;
  /* 阴影 */
  box-shadow: 0px 0px 10px 1.5px rgba(199, 198, 198, 0.893);
  padding-top: 20px;
  padding-bottom: 20px;
}

.description {
  text-align: center;
  font-size: 23px;
}

.datePickerContainer {
  display: flex;
  justify-content: flex-end;
  position: relative;
  padding: 50px 0 30px;
}

.text {
  margin-left: 5px;
  margin-right: 10px;
}

.imgContainer {
  overflow: hidden;
  // margin: 0px 10%;
  background-color: white;
  /* 圆角 */
  border-radius: 8px;
  /* 阴影 */
  box-shadow: 0px 0px 10px 1.5px rgba(199, 198, 198, 0.893);
  padding-top: 20px;
  padding-bottom: 20px;
}

.image {
  width: 100%;
  margin-top: -7.5%;
  margin-bottom: -5%;
  // transform: translateX(-3%);
}

// 以下是新加代码
.banner {
  position: relative;
  height: 420px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.banner img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% -155px;
  /* 水平居中，垂直向下偏移20px */
  /* 确保图片在文字下方 */
  z-index: 0;
}

.menu-container {
  display: flex;
  //height: 105px;
  height: 85px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: -50px;
}

ul.menu {
  position: relative;
  list-style-type: none;
  height: 100%;
  display: flex;
  padding: 0px;
  flex-direction: row;
  justify-content: center;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  /* 新增: 确保伪元素不会超出 ul.menu 边界 */
}

/* 新增: 添加一个伪元素用于整个选项卡区域的上半部分透明或阴影效果 */
ul.menu::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 55%;
  /* 仅覆盖上半部分 */
  background-color: rgba(240, 240, 240, 0.8);
  /* 上半部分透明效果，或更改为 box-shadow 实现阴影效果 */
  z-index: 0;
  /* 确保伪元素在 li 元素下方 */
  pointer-events: none;
  /* 确保透明层不影响鼠标事件 */
}

ul.menu li {
  position: relative;
  display: flex;
  width: 250px;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  /* 更改鼠标形状为手形 */
  overflow: hidden;
  /* 确保伪元素的边界与 li 元素一致 */
}

ul.menu li:not(:last-child)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  width: 2px;
  height: 50%;
  background-color: #00000020;
  transform: translateY(-50%);
}

// ul.menu li:hover::before {
//   content: "";
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   //background-color: rgba(240, 240, 240, 0.8); /* 浅灰色 */
//   border-radius: 10px; /* 确保形状与选项卡一致 */
//   pointer-events: none; /* 确保伪元素不影响鼠标事件 */
//   z-index: 1; /* 确保覆盖层在文字和内容下方 */
// }

ul.menu li:hover p {
  color: rgb(71, 72, 76);
  z-index: 2;
  /* 确保文字在覆盖层之上 */
}

/* 已经被选中的选项卡在鼠标悬停时字体颜色不变 */
ul.menu li.chart-name-selected:hover p {
  color: inherit; //保持原有颜色
}

.mov-box {
  position: absolute;
  z-index: 3;
  /* 确保滑动条在覆盖层之上 */
}

.chart-name-selected {
  color: rgb(30, 158, 179)
}


.text-container {
  position: relative;
  margin: 0px auto;
  text-align: center;
  background-color: rgba(239, 242, 252, 0.801);
  ;
  /* 淡紫色 */
  display: flex;
  padding: 20px;
  border-radius: 8px;
  /* 可选的圆角 */
  box-shadow: 0px 0px 10px 1.5px rgba(199, 198, 198, 0.893);
  /* 阴影 */
  font-family: 'STKaiti';
  // font-size: 18px;
}
</style>