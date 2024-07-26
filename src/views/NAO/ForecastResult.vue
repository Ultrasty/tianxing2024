<script setup>

import { ref, onMounted, defineExpose } from "vue";
import axios from 'axios';
//import VChart from 'vue-echarts';
//import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';

const selectedNAOI = ref(true)
const selectedSLP = ref(false)

const currentDate = new Date();
const year = currentDate.getFullYear() + '';
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

const NAOISelectedYear = ref('');
const NAOISelectedMonth = ref('');
const SLPSelectedYear = ref('');
const SLPSelectedMonth = ref('');

let NAOIStartYear = 0;
let NAOIStartMonth = 0;
let NAOIEndYear = 0;
let NAOIEndMonth = 0;

let SLPStartYear = 0;
let SLPStartMonth = 0;
let SLPEndYear = 0;
let SLPEndMonth = 0;

NAOISelectedYear.value = year;
NAOISelectedMonth.value = month;
SLPSelectedYear.value = year;
SLPSelectedMonth.value = month;

const NAOIChartTitle = ref('')
const SLPChartTitle = ref('')

const NAOIOption = ref({})
const NAOIDescription = ref('')
//const SLPDescription = ref('')
   
const imgSrc = ref([]);
const imgIndex = ref(0);

const NAOILoading = ref(false);
const SLPLoading = ref(false);

function selectChart(tab) {
  if(tab.index == 0) {
    selectedNAOI.value = true;
    selectedSLP.value = false;
  }
  else {
    selectedNAOI.value = false;
    selectedSLP.value = true;
  }
}

// 请求NAOI数据
const updateNAOIChart = async () => {
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
      NAOISelectedYear.value = NAOIEndYear;
      NAOISelectedMonth.value = NAOIEndMonth.toString().padStart(2, '0');
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
      SLPSelectedYear.value = SLPEndYear;
      SLPSelectedMonth.value = SLPEndMonth.toString().padStart(2, '0');
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
  if(Number(month1) > 7) {
    month2 = Number(month1) - 7 + '';
    year2 = Number(year1) + 1 + '';
  }
  else {
    month2 = Number(month1) + 5 + '';
    year2 = year1;
  }
  if(month2.length == 1) {
    month2 = '0' + month2;
  }
  NAOIChartTitle.value = year1 + '年' + month1 + '月~' + year2 + '年' + month2 + '月 NAO预测结果';
}

function updateSLPChartTitle() {
  SLPChartTitle.value = SLPSelectedYear.value + '年' + SLPSelectedMonth.value + '月 北大西洋SLP预测结果';
}

function NAOIDisabledYear(day) {
  const year = day.getFullYear();
  if(year < NAOIStartYear || year > NAOIEndYear)
    return true;
  else
    return false;
}

function NAOIDisabledMonth(day) {
  const month = day.getMonth() + 1;
  if(NAOISelectedYear.value == NAOIStartYear && month < NAOIStartMonth)
    return true;
  else if(NAOISelectedYear.value == NAOIEndYear && month > NAOIEndMonth)
    return true;
  else
    return false;
}

function SLPDisabledYear(day) {
  const year = day.getFullYear();
  if(year < SLPStartYear || year > SLPEndYear)
    return true;
  else
    return false;
}

function SLPDisabledMonth(day) {
  const month = day.getMonth() + 1;
  if(SLPSelectedYear.value == SLPStartYear && month < SLPStartMonth)
    return true;
  else if(SLPSelectedYear.value == SLPEndYear && month > SLPEndMonth)
    return true;
  else
    return false;
}

/* 使el-button点击后能正常失焦 Start */
const buttonLeft = ref(null);
const buttonRight = ref(null);

const changeIndex = (direction) => {
  if(direction == 'left') { // 点击了左按钮
    if(imgIndex.value == 0)
      imgIndex.value = imgSrc.value.length - 1;
    else
      imgIndex.value--;
    buttonLeft.value.$el.blur(); // 使左按钮失焦
  }
  else { // 点击了右按钮
    if(imgIndex.value == imgSrc.value.length - 1)
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
    <h1 v-show="selectedNAOI" class="title">
      {{ NAOIChartTitle }}
    </h1>
    <h1 v-show="selectedSLP" class="title">
      {{ SLPSelectedYear }}年{{ SLPSelectedMonth }}月 北大西洋SLP预测结果
    </h1>
    <div class="datePickerContainer">
      <el-date-picker @change="updateNAOIChart" v-if="selectedNAOI" v-model="NAOISelectedYear" type="year" format="YYYY" value-format="YYYY" :clearable="false" style="width: 80px; height: 25px" :disabled-date="NAOIDisabledYear" />
      <el-date-picker @change="updateSLPChart" v-if="selectedSLP" v-model="SLPSelectedYear" type="year" format="YYYY" value-format="YYYY" :clearable="false" style="width: 80px; height: 25px" :disabled-date="SLPDisabledYear" />
      <div class="text">年</div>
      <el-date-picker @change="updateNAOIChart" v-if="selectedNAOI" v-model="NAOISelectedMonth" type="month" format="MM" value-format="MM" :clearable="false" style="width: 60px; height: 25px" :disabled-date="NAOIDisabledMonth" />
      <el-date-picker @change="updateSLPChart" v-if="selectedSLP" v-model="SLPSelectedMonth" type="month" format="MM" value-format="MM" :clearable="false" style="width: 60px; height: 25px" :disabled-date="SLPDisabledMonth" />
      <div class="text">月</div>
    </div>
    <el-tabs type="border-card" @tab-click="selectChart" :stretch="true">
      <el-tab-pane label="指数预测" v-loading="NAOILoading && selectedNAOI">
        <v-chart class="NAOIChart" :option="NAOIOption" autoresize />
        <div class="description">
          {{ NAOIDescription }}
        </div>
      </el-tab-pane>
      <el-tab-pane label="模态预测" v-loading="SLPLoading && selectedSLP" style="min-height: 350px">
        <h3 v-show="!SLPLoading" style="text-align: center; margin-top: 0px; margin-bottom: 15px">{{ SLPChartTitle }}</h3>
        <h4 v-show="!SLPLoading" style="text-align: center; margin-top: 0px; margin-bottom: 15px; font-size: 16px">({{ imgIndex + 1 }}/{{ imgSrc.length }})</h4>
        <el-row v-show="!SLPLoading">
          <el-col :span="2">
            <el-button ref="buttonLeft" type="primary" class="arrowLeft" :icon="ArrowLeft" @click="changeIndex('left')" />
          </el-col>
          <el-col :span="20">
            <div class="imgContainer">
              <img v-if="imgSrc.length" :src="'http://tianxing.tongji.edu.cn' + imgSrc[imgIndex]" class="image" alt="" />
            </div>
          </el-col>
          <el-col :span="2">
            <el-button ref="buttonRight" type="primary" class="arrowRight" :icon="ArrowRight" @click="changeIndex('right')" />
          </el-col>
        </el-row>
        <!-- <div class="description">
          {{ SLPDescription }}
        </div> -->
        <!-- 接口未提供描述 -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.title {
  text-align: center
}

.NAOIChart {
  height: 500px;
}

.description {
  margin-top: 20px;
  font-size: 16px;
  text-align: center;
}

.datePickerContainer {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.text {
  margin-left: 5px;
  margin-right: 10px;
}

.imgContainer {
  overflow: hidden;
}

.image {
  width: 100%;
  margin-top: -7.5%;
  transform: translateX(-3%);
}

.el-button.arrowLeft {
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 4%;
  width: 5%;
  height: 30%;
  min-width: 40px;
  min-height: 80px;
  max-width: 50px;
  max-height: 115px;
  transform: translateY(-65%);
  font-size: 20px;
}

.el-button.arrowRight {
  z-index: 1;
  position: absolute;
  top: 50%;
  right: 4%;
  width: 5%;
  height: 30%;
  min-width: 40px;
  min-height: 80px;
  max-width: 50px;
  max-height: 115px;
  transform: translateY(-65%);
  font-size: 20px;
}
</style>