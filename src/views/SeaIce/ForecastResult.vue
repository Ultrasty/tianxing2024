<script setup>
import { ref, onMounted, computed } from "vue";
import axios from 'axios';
import VChart from 'vue-echarts';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import bannerImg from '@/assets/header.jpg';

const selectedSIE = ref(true);
const selectedSIC = ref(false);

const selectedTime = ref(new Date('2023-01'));

const selectedYear = computed(() => {
  return selectedTime.value.getFullYear();
})
const selectedMonth = computed(() => {
  return selectedTime.value.getMonth() + 1;
})
const selectedDay = computed(() => { return selectedTime.value; });

const SIEAvailableList = ref([]);
const SICAvailableList = ref({
  yearList: [],
  monthList: [],
  dateList: []
});

const SIEChartTitle = ref('');
const SICChartTitle = ref('');

const SIEOption = ref({});
const SIEDescription = ref('');

const imgSrc = ref([]);
const imgIndex = ref(0);

const SIELoading = ref(false);
const SICLoading = ref(false);

const chartSelected = ref(0);
const chartNames = ['SIE指数', 'SIC模态'];

const moveBoxLeft = computed(() => chartSelected.value * 250);
const movBoxStyle = computed(() => ({
  position: "absolute",
  bottom: "0px",
  left: `${moveBoxLeft.value}px`,
  height: "2px",
  width: "125px",
  transform: "translateX(50%)",
  backgroundColor: "blue",
  transition: "left 0.3s ease"
}));

function selectChart(index) {
  chartSelected.value = index;
  selectedSIE.value = index === 0;
  selectedSIC.value = index === 1;
  if (selectedSIE.value) {
    updateSIEChart();
  } else {
    updateSICChart();
  }
}

// 请求SIE数据
const updateSIEChart = async () => {
  SIELoading.value = true;
  updateSIEChartTitle();
  const params = {
    year: Number(selectedYear.value),
    month: Number(selectedMonth.value)
  };
  axios.get('/seaice/predictionResult/SIE', { params })
    .then(response => {
      SIEOption.value = response.data.option;
      SIEDescription.value = response.data.description;
      SIELoading.value = false;
    })
    .catch(error => {
      console.error(error);
      SIELoading.value = false;
    });
}

// 请求SIC数据
const updateSICChart = async () => {
  //使元素失焦
  document.activeElement.blur();

  SICLoading.value = true;
  updateSICChartTitle();
  const params = {
    year: selectedDay.value.getFullYear(),
    month: selectedDay.value.getMonth() + 1,
    day: selectedDay.value.getDate()
  };
  axios.get('/seaice/predictionResult/SIC', { params })
    .then(response => {
      imgSrc.value = response.data;
      imgIndex.value = 0;
      loadImg(imgSrc.value);
      SICLoading.value = false;
    })
    .catch(error => {
      console.error(error);
      SICLoading.value = false;
    });
}

// 初始化SIE可请求的年月
const initSIEAvailableList = () => {
  updateSIEChartTitle();
  SIELoading.value = true;
  const params = {
    year: 2023,
    month: 1
  };
  axios.get('/seaice/predictionResult/SIE', { params })
    .then(response => {
      SIEAvailableList.value = response.data.availableList;
      SIEOption.value = response.data.option;
      SIEDescription.value = response.data.description;
      SIELoading.value = false;
    })
    .catch(error => {
      console.error(error);
      SIELoading.value = false;
    });
}

// 初始化SIC可请求的年月
const initSICAvailableList = () => {
  updateSICChartTitle();
  SICLoading.value = true;
  axios.get('/seaice/initial/SICprediction')
    .then(response => {
      SICAvailableList.value.yearList = response.data.yearList;
      SICAvailableList.value.monthList = response.data.monthList;
      SICAvailableList.value.dateList = response.data.dateList;
      imgSrc.value = response.data.sicInitial;
      let newestYear = Math.max(...SICAvailableList.value.yearList);
      let newestMonth = Math.max(...SICAvailableList.value.monthList);
      let newestDate = Math.max(...SICAvailableList.value.dateList);
      //selectedDay.value = new Date(newestYear, newestMonth - 1, newestDate);
      selectedTime.value = new Date(newestYear, newestMonth - 1, newestDate);
      imgIndex.value = 0;
      loadImg(imgSrc.value);
      SICLoading.value = false;
      updateSICChartTitle();
    })
    .catch(error => {
      console.error(error);
      SICLoading.value = false;
    });
}

function updateSIEChartTitle() {
  //使元素失焦
  document.activeElement.blur();

  let year1 = selectedYear.value;
  let month1 = selectedMonth.value;
  let year2 = '';
  let month2 = '';
  if (Number(month1) === 1) {
    month2 = '12';
    year2 = year1;
  }
  else {
    month2 = (Number(month1) - 1).toString().padStart(2, '0');
    year2 = Number(year1) + 1 + '';
  }
  SIEChartTitle.value = year1 + '年' + month1 + '月~' + year2 + '年' + month2 + '月 海冰预测结果';
}

function updateSICChartTitle() {
  SICChartTitle.value = selectedDay.value.getFullYear() + '年' + (selectedDay.value.getMonth() + 1) + '月' + selectedDay.value.getDate() + '日 海冰SIC预测结果';
}

function disabledMonth(day) {
  const year = day.getFullYear();
  const month = day.getMonth() + 1;
  for (let i = 0; i < SIEAvailableList.value.length; i++) {
    if (year == SIEAvailableList.value[i].year && month == SIEAvailableList.value[i].month) {
      return false;
    }
  }
  return true;
}

function disabledDate(day) {
  const year = day.getFullYear();
  const month = day.getMonth() + 1;
  const date = day.getDate();
  for (let i = 0; i < SICAvailableList.value.yearList.length; i++) {
    for (let j = 0; j < SICAvailableList.value.monthList.length; j++) {
      for (let k = 0; k < SICAvailableList.value.dateList.length; k++) {
        if (year == SICAvailableList.value.yearList[i] && month == SICAvailableList.value.monthList[j] && date == SICAvailableList.value.dateList[k]) {
          return false;
        }
      }
    }
  }
  return true;
}

/* 使el-button点击后能正常失焦 Start */
const buttonLeft = ref(null);
const buttonRight = ref(null);

const changeIndex = (direction) => {
  if (direction === 'left') {
    imgIndex.value = imgIndex.value === 0 ? imgSrc.value.length - 1 : imgIndex.value - 1;
    buttonLeft.value.$el.blur();
  } else {
    imgIndex.value = imgIndex.value === imgSrc.value.length - 1 ? 0 : imgIndex.value + 1;
    buttonRight.value.$el.blur();
  }
};

defineExpose({ changeIndex });
/* 使el-button点击后能正常失焦 End */

// 图片预加载
const loadImg = (imgList) => {
  imgList.forEach(src => {
    let img = new Image();
    img.src = 'http://tianxing.tongji.edu.cn' + src;
    img.onload = () => console.log('加载完毕', img.src);
    img.onerror = () => console.log('加载错误', img.src);
  });
}

onMounted(() => {
  initSIEAvailableList();
  initSICAvailableList();
});
</script>

<template>
  <div class="pageContent">
    <div class="banner">
      <img :src="bannerImg" />
      <h3 class="title">海冰预测结果</h3>
    </div>

    <div class="menu-container">
      <ul class="menu">
        <div :style="movBoxStyle" class="mov-box"></div>
        <li v-for="(chartName, index) of chartNames" :key="chartName" @click="selectChart(index)"
          :class="{ 'chart-name-selected': chartSelected === index }">
          <p>{{ chartName }}</p>
        </li>
      </ul>
    </div>

    <div style="margin: 0 10%;">

    <div class="datePickerContainer">
      <el-date-picker @change="updateSIEChartTitle" v-model="selectedTime" :clearable="false" type="month"
        :disabled-date="disabledMonth" v-if="selectedSIE" />
      <el-date-picker @change="updateSICChart" v-model="selectedTime" :clearable="false" :disabled-date="disabledDate"
        v-if="selectedSIC" />
    </div>

    <div class="text-container" v-if="selectedSIE">
      <div class="description">
        {{ SIEDescription }}
      </div>
    </div>
    <!-- 不需要额外的表头 -->
    <!-- <h1 v-show="selectedSIE" class="title">
      {{ SIEChartTitle }}
    </h1>
    <h1 v-show="selectedSIC" class="title">
      {{ SICChartTitle }}
    </h1> -->
    </div>

    <div><p></p></div>
    
    <div v-if="selectedSIE" class="chart-selector">
      <v-chart class="SIEChart" :option="SIEOption" autoresize />
    </div>

    <div style="margin:0 10%;">
    <div v-if="selectedSIC" class="whole_container">
      <h3 style="text-align: center; margin-top: 0px; font-size: 18px">{{ SICChartTitle }}</h3>
      <h4 style="text-align: center; margin-top: 0px; font-size: 16px">({{ imgIndex + 1 }}/{{ imgSrc.length }})</h4>
      <div class="imageContainer">
        <div>
        <img v-if="imgSrc.length" :src="'http://tianxing.tongji.edu.cn' + imgSrc[imgIndex]" class="image" alt="" />
        </div>
        <el-button ref="buttonLeft" type="primary" class="arrowLeft" :icon="ArrowLeft" @click="changeIndex('left')" />
        <el-button ref="buttonRight" type="primary" class="arrowRight" :icon="ArrowRight"
          @click="changeIndex('right')" />
      </div>
    </div>
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
  letter-spacing: 1px; /* 字符间距 */
  z-index: 1; /* 确保图片在文字下方 */
  color:#ffffff;
}

.banner {
  position: relative;
  height: 500px;
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
  /* 确保图片在文字下方 */
  z-index: 0;
}

.menu-container {
  display: flex;
  height: 105px;
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
}

ul.menu li {
  position: relative;
  display: flex;
  width: 250px;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer; /* 更改鼠标形状为手形 */
  overflow: hidden; /* 确保伪元素的边界与 li 元素一致 */
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

ul.menu li:hover::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(240, 240, 240, 0.8); /* 浅灰色 */
  border-radius: 10px; /* 确保形状与选项卡一致 */
  pointer-events: none; /* 确保伪元素不影响鼠标事件 */
  z-index: 1; /* 确保覆盖层在文字和内容下方 */
}

ul.menu li:hover p {
  color: rgb(255, 89, 0);
  z-index: 2; /* 确保文字在覆盖层之上 */
}
.mov-box {
  position: absolute;
  z-index: 3; /* 确保滑动条在覆盖层之上 */
}


.chart-name-selected {
  color:blue;
  //color: rgba(0, 55, 255, 0.957);
}

.datePickerContainer {
  /* 其他样式 */
  display: flex;
  justify-content: flex-end;
  position: relative;
  padding: 50px 0 30px;
  margin-right: 5%; //new
}

.SIEChartContainer {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // padding: 0px 15%;
}

.text {
  margin-left: 5px;
  margin-right: 10px;
}

.whole_container {
  position: relative;
}

.imageContainer {
  text-align: center;
  /* 使图片在容器内居中 */
  max-width: 100%;
  // margin: 0% 10%;
  overflow: hidden;
  background-color:white;
  /* 圆角 */
  border-radius: 8px;
  /* 阴影 */
  box-shadow: 0px 0px 10px 1.5px rgba(199, 198, 198, 0.893);
  padding-top: 20px;
  padding-bottom: 20px;
  width: 40%;
  margin: auto;
}

.SIEChart {
  height: 500px;
  background-color:white;
  /* 圆角 */
  border-radius: 8px;
  /* 阴影 */
  box-shadow: 0px 0px 10px 1.5px rgba(199, 198, 198, 0.893);
  padding-top: 20px;
  padding-bottom: 20px;
}

//这里应用全球天气的picture样式
.image {
  width: 100%;
  display: block;
  /* 将元素设置为块级元素 */
  height: auto;
  /* 保持图片比例 */
  display: inline-block;
  /* 使图片可以与 text-align 一起使用 */
}

//下面这个样式不用加，因为全局样式里面有对应的了

// /* 设置箭头按钮的样式 */
// .el-button.arrowLeft,
// .el-button.arrowRight {
//   position: relative;
//   margin: 20px;
//   width: 40px;
//   height: 80px;
// }


.description {
  position: relative;
  text-align: center;
  /* 使文本内容居中 */
  font-size: 23px;
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
