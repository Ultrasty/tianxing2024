<script setup>
import { ref, onMounted, reactive, watch, defineExpose, computed } from "vue";
import * as echarts from "echarts";
import axios from "axios";
import VChart from 'vue-echarts';
import { nextTick } from "vue";
import { configProviderContextKey } from "element-plus";
import ImmersivePicture from "../user/ImmersivePicture.vue";

//时间选择器范围框定--start
const start_time = ref(null);
const end_time = ref(null);
/* 赋初值————默认为气温预测 */
axios.get('/imgs/WEA_T2M/getInitData')
  .then(res => {
    start_time.value = new Date(res.data.earliestDate);
    end_time.value = new Date(res.data.latestDate);
  });

const disabledMinute = () => {
  const allowedMinute = [0];
  const disabledMinute = [];

  for (let i = 0; i < 60; i++) {
    if (!allowedMinute.includes(i)) {
      disabledMinute.push(i);
    }
  }

  return disabledMinute;
};

const disabledSecond = () => {
  const allowedSecond = [0];
  const disabledSecond = [];

  for (let i = 0; i < 60; i++) {
    if (!allowedSecond.includes(i)) {
      disabledSecond.push(i);
    }
  }

  return disabledSecond;
};

const limitedDateRange = (time) => {
  return time.getTime() < start_time.value || time.getTime() > end_time.value;
};

//这里更改传入参数，传入列表名称和标号
function handleClick(chartName, index) {
  //这里标号发生改变，图表切换
  chartSelected.value = index;

  if (chartName == '气温预测') {
    axios.get('/imgs/WEA_T2M/getInitData')
      .then(res => {
        start_time.value = new Date(res.data.earliestDate);
        end_time.value = new Date(res.data.latestDate);
      });
  }
  else if (chartName == '降水预测') {
    axios.get('/imgs/WEA_TP/getInitData')
      .then(res => {
        start_time.value = new Date(res.data.earliestDate);
        end_time.value = new Date(res.data.latestDate);
        //end_time.value = new Date('2019-3-3');    //此行可以证明限制范围有根据选项卡改动
      });
  }
  else {     //风场预测
    axios.get('/imgs/WEA_U10/getInitData')
      .then(res => {
        start_time.value = new Date(res.data.earliestDate);
        end_time.value = new Date(res.data.latestDate);
      });
  }
}
//时间选择器范围框定--end

const selectedDateTime = ref(null);
const selectedYear = ref(null); // 新变量，用于存储选定的年份
const selectedMonth = ref(null); // 新变量，用于存储选定的月份
const selectedDay = ref(null); // 新变量，用于存储选定的日期
const selectedHour = ref(null); // 新变量，用于存储选定的小时

//第一次进入为用户赋初值
const date = new Date(2019, 0, 1, 0, 0, 0);
selectedDateTime.value = date;
selectedYear.value = date.getFullYear();
selectedMonth.value = date.getMonth() + 1;
selectedDay.value = date.getDate();
selectedHour.value = date.getHours();


var index_tempe = 0; //切换气温预测时修改这个索引
var index_rain = 0; //切换降水预测时修改这个索引
var index_wind = 0;//切换风场的第一张图修改这个索引
var index_wind2 = 0;//切换风场的第二张图修改这个索引
const prefix = "https://tianxing.tongji.edu.cn"

var title_of_temperature_Array;
var imgSrc_of_temperature_Array;
var text_of_temperature_Array;

var title_of_rain_Array;
var imgSrc_of_rain_Array;
var text_of_rain_Array;

var title_of_wind_Array;
var imgSrc_of_wind_Array;
var text_of_wind_Array;

var title_of_wind2_Array;
var imgSrc_of_wind2_Array;
var text_of_wind2_Array;

const imgSrc_of_temperature = ref({})
const imgSrc_of_rain = ref({})
const imgSrc_of_wind = ref({})
const imgSrc_of_wind2 = ref({})
const title_of_temperature = ref({})
const text_of_temperature = ref({})
const title_of_rain = ref({})
const text_of_rain = ref({})
const title_of_wind = ref({})
const text_of_wind = ref({})
const title_of_wind2 = ref({})
const text_of_wind2 = ref({})

/* 避免未选择时屏幕上出现{} */
title_of_temperature.value = '';
text_of_temperature.value = '';
title_of_rain.value = '';
text_of_rain.value = '';
title_of_wind.value = '';
text_of_wind.value = '';
title_of_wind2.value = '';
text_of_wind2.value = '';

/* 赋初值 */
axios.get('/imgs/WEA_T2M/getImgsPath?year=' + selectedYear.value + '&month=' + selectedMonth.value + '&day=' + selectedDay.value + '&hour=' + selectedHour.value)
  //axios.get("/imgs/WEA_T2M/getImgsPath?year=2019&month=1&day=1&hour=0")
  .then(res => {
    index_tempe = 0;
    //console.log(res.data.titles);
    title_of_temperature_Array = res.data.titles;
    imgSrc_of_temperature_Array = res.data.imgSrc;
    text_of_temperature_Array = res.data.texts;
    title_of_temperature.value = title_of_temperature_Array[0];
    imgSrc_of_temperature.value = `${prefix}${imgSrc_of_temperature_Array[0]}`;
    text_of_temperature.value = text_of_temperature_Array[0];
  });
axios.get('/imgs/WEA_TP/getImgsPath?year=' + selectedYear.value + '&month=' + selectedMonth.value + '&day=' + selectedDay.value + '&hour=' + selectedHour.value)
  //axios.get("/imgs/WEA_TP/getImgsPath?year=2019&month=1&day=1&hour=0")
  .then(res => {
    index_rain = 0;
    //console.log(res.data.titles);
    //console.log(res.data.texts);
    title_of_rain_Array = res.data.titles;
    imgSrc_of_rain_Array = res.data.imgSrc;
    text_of_rain_Array = res.data.texts;
    title_of_rain.value = title_of_rain_Array[0];
    imgSrc_of_rain.value = `${prefix}${imgSrc_of_rain_Array[0]}`;
    text_of_rain.value = text_of_rain_Array[0];
  });
axios.get('/imgs/WEA_U10/getImgsPath?year=' + selectedYear.value + '&month=' + selectedMonth.value + '&day=' + selectedDay.value + '&hour=' + selectedHour.value)
  .then(res => {
    index_wind = 0;
    console.log(res.data.titles);
    console.log(res.data.texts);
    title_of_wind_Array = res.data.titles;
    imgSrc_of_wind_Array = res.data.imgSrc;
    text_of_wind_Array = res.data.texts;
    title_of_wind.value = title_of_wind_Array[0];
    imgSrc_of_wind.value = `${prefix}${imgSrc_of_wind_Array[0]}`;
    text_of_wind.value = text_of_wind_Array[0];
  });
axios.get('/imgs/WEA_MSLP/getImgsPath?year=' + selectedYear.value + '&month=' + selectedMonth.value + '&day=' + selectedDay.value + '&hour=' + selectedHour.value)
  .then(res => {
    index_wind2 = 0;
    console.log(res.data.titles);
    console.log(res.data.texts);
    title_of_wind2_Array = res.data.titles;
    imgSrc_of_wind2_Array = res.data.imgSrc;
    text_of_wind2_Array = res.data.texts;
    title_of_wind2.value = title_of_wind2_Array[0];
    imgSrc_of_wind2.value = `${prefix}${imgSrc_of_wind2_Array[0]}`;
    text_of_wind2.value = text_of_wind2_Array[0];
  });

const handleDateTimeChange = () => {
  //使元素失焦
  document.activeElement.blur();

  // 当日期时间选择发生变化时被调用
  console.log(selectedDateTime.value); // 输出当前选择的日期和时间

  if (selectedDateTime.value) {
    const selectedDate = new Date(selectedDateTime.value);
    selectedYear.value = selectedDate.getFullYear(); // 获取年份值并存储到 selectedYear
    selectedMonth.value = selectedDate.getMonth() + 1; // 获取月份值并存储到 selectedMonth
    selectedDay.value = selectedDate.getDate(); // 获取日期值并存储到 selectedDay
    selectedHour.value = selectedDate.getHours(); // 获取小时值并存储到 selectedHour
  }

  axios.get('/imgs/WEA_T2M/getImgsPath?year=' + selectedYear.value + '&month=' + selectedMonth.value + '&day=' + selectedDay.value + '&hour=' + selectedHour.value)
    //axios.get("/imgs/WEA_T2M/getImgsPath?year=2019&month=1&day=1&hour=0")
    .then(res => {
      index_tempe = 0;
      //console.log(res.data.title);
      title_of_temperature_Array = res.data.titles;
      imgSrc_of_temperature_Array = res.data.imgSrc;
      text_of_temperature_Array = res.data.texts;
      title_of_temperature.value = title_of_temperature_Array[0];
      imgSrc_of_temperature.value = `${prefix}${imgSrc_of_temperature_Array[0]}`;
      text_of_temperature.value = text_of_temperature_Array[0];
    });

  axios.get('/imgs/WEA_TP/getImgsPath?year=' + selectedYear.value + '&month=' + selectedMonth.value + '&day=' + selectedDay.value + '&hour=' + selectedHour.value)
    //axios.get("/imgs/WEA_TP/getImgsPath?year=2019&month=1&day=1&hour=0")
    .then(res => {
      index_rain = 0;
      //console.log(res.data.imgSrc);
      title_of_rain_Array = res.data.titles;
      imgSrc_of_rain_Array = res.data.imgSrc;
      text_of_rain_Array = res.data.texts;
      title_of_rain.value = title_of_rain_Array[0];
      imgSrc_of_rain.value = `${prefix}${imgSrc_of_rain_Array[0]}`;
      text_of_rain.value = text_of_rain_Array[0];
    });
  axios.get('/imgs/WEA_U10/getImgsPath?year=' + selectedYear.value + '&month=' + selectedMonth.value + '&day=' + selectedDay.value + '&hour=' + selectedHour.value)
    .then(res => {
      index_wind = 0;
      console.log(res.data.imgSrc);
      title_of_wind_Array = res.data.titles;
      imgSrc_of_wind_Array = res.data.imgSrc;
      text_of_wind_Array = res.data.texts;
      title_of_wind.value = title_of_wind_Array[0];
      imgSrc_of_wind.value = `${prefix}${imgSrc_of_wind_Array[0]}`;
      text_of_wind.value = text_of_wind_Array[0];
    });
  axios.get('/imgs/WEA_MSLP/getImgsPath?year=' + selectedYear.value + '&month=' + selectedMonth.value + '&day=' + selectedDay.value + '&hour=' + selectedHour.value)
    .then(res => {
      index_wind2 = 0;
      console.log(res.data.imgSrc);
      title_of_wind2_Array = res.data.titles;
      imgSrc_of_wind2_Array = res.data.imgSrc;
      text_of_wind2_Array = res.data.texts;
      title_of_wind2.value = title_of_wind2_Array[0];
      imgSrc_of_wind2.value = `${prefix}${imgSrc_of_wind2_Array[0]}`;
      text_of_wind2.value = text_of_wind2_Array[0];
    });
}

/* 使el-button点击后能正常失焦 Start (by wyf)*/
const buttonLeftTemp = ref(null);
const buttonRightTemp = ref(null);
const buttonLeftRain = ref(null);
const buttonRightRain = ref(null);
const buttonLeftWind = ref(null);
const buttonRightWind = ref(null);
const buttonLeftWind2 = ref(null);
const buttonRightWind2 = ref(null);

/* 左右切换 -- begin */
function change_time_tempe(flag) {

  if (flag === "left") {
    if (index_tempe > 0) {
      index_tempe--;
    }
    else {
      index_tempe = 19;
    }
    buttonLeftTemp.value.$el.blur();
  }
  else if (flag === "right") {
    if (index_tempe < 19) {
      index_tempe++;
    }
    else {
      index_tempe = 0;
    }
    buttonRightTemp.value.$el.blur();
  }
  title_of_temperature.value = title_of_temperature_Array[index_tempe];
  imgSrc_of_temperature.value = `${prefix}${imgSrc_of_temperature_Array[index_tempe]}`;
  text_of_temperature.value = text_of_temperature_Array[index_tempe];
}
function change_time_rain(flag) {

  if (flag === "left") {
    if (index_rain > 0) {
      index_rain--;
    }
    else {
      index_rain = 19;
    }
    buttonLeftRain.value.$el.blur();
  }
  else if (flag === "right") {
    if (index_rain < 19) {
      index_rain++;
    }
    else {
      index_rain = 0;
    }
    buttonRightRain.value.$el.blur();
  }
  title_of_rain.value = title_of_rain_Array[index_rain];
  imgSrc_of_rain.value = `${prefix}${imgSrc_of_rain_Array[index_rain]}`;
  text_of_rain.value = text_of_rain_Array[index_rain];
}

function change_time_wind(flag) {

  if (flag === "left") {
    if (index_wind > 0) {
      index_wind--;
    }
    else {
      index_wind = 19;
    }
    buttonLeftWind.value.$el.blur();
  }
  else if (flag === "right") {
    if (index_wind < 19) {
      index_wind++;
    }
    else {
      index_wind = 0;
    }
    buttonRightWind.value.$el.blur();
  }
  title_of_wind.value = title_of_wind_Array[index_wind];
  imgSrc_of_wind.value = `${prefix}${imgSrc_of_wind_Array[index_wind]}`;
  text_of_wind.value = text_of_wind_Array[index_wind];
}

function change_time_wind2(flag) {

  if (flag === "left") {
    if (index_wind2 > 0) {
      index_wind2--;
    }
    else {
      index_wind2 = 19;
    }
    buttonLeftWind2.value.$el.blur();
  }
  else if (flag === "right") {
    if (index_wind2 < 19) {
      index_wind2++;
    }
    else {
      index_wind2 = 0;
    }
    buttonRightWind2.value.$el.blur();
  }
  title_of_wind2.value = title_of_wind2_Array[index_wind2];
  imgSrc_of_wind2.value = `${prefix}${imgSrc_of_wind2_Array[index_wind2]}`;
  text_of_wind2.value = text_of_wind2_Array[index_wind2];
}
/* 左右切换 -- end */

defineExpose({
  change_time_tempe,
  change_time_rain,
  change_time_wind,
  change_time_wind2
});
/* 使el-button点击后能正常失焦 End */
//新添加代码
import bannerImg from '@/assets/light.jpg';


const chartSelected = ref(0);

const chartNames = ['气温预测', '降水预测', '风场预测'];

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
import {
  ArrowLeft,
  ArrowRight
} from "@element-plus/icons-vue";

</script>

<template>
  <div class="pageContent">
    <div class="banner">
      <img :src="bannerImg" />
      <h3 class="title">全球天气预报结果</h3>
    </div>

    <div class="menu-container">
      <ul class="menu">
        <div :style="movBoxStyle" class="mov-box"></div>
        <li v-for="(chartName, index) of chartNames" :key="chartName" @click="handleClick(chartName, index)"
          :class="{ 'chart-name-selected': chartSelected === index }">
          <p>{{ chartName }}</p>
        </li>
      </ul>
    </div>

    <div style="margin: 0px 10%;">

      <div class="datePickerContainer">
        <el-date-picker @change="handleDateTimeChange()" v-model="selectedDateTime" type="date" :clearable="false"
          :disabledDate="limitedDateRange" />
      </div>

      <div class="text-container" v-if="chartSelected === 0">
        <p class="text_of_graph">{{ text_of_temperature }}</p>
      </div>
      <div class="text-container" v-if="chartSelected === 1">
        <p class="text_of_graph">{{ text_of_rain }}</p>
      </div>
      <div class="text-container" v-if="chartSelected === 2">
        <div>
          <p class="text_of_graph">{{ text_of_wind }}</p>
          <p class="text_of_graph">{{ text_of_wind2 }}</p>
        </div>
      </div>

    </div>

    <div>
      <p></p>
    </div>

    <div class="chart-selector" v-if="chartSelected === 0">
      <div class="whole_container">
        <p class="picture_title">
          {{ title_of_temperature }}
        </p>
        <div class="pic_container">
          <immersive-picture :src="imgSrc_of_temperature" />
        </div>
        <el-button ref="buttonLeftTemp" type="primary" class="arrow-left" :icon="ArrowLeft"
          @click="change_time_tempe('left')"></el-button>
        <el-button ref="buttonRightTemp" type="primary" class="arrow-right" :icon="ArrowRight"
          @click="change_time_tempe('right')"></el-button>
      </div>
    </div>

    <div class="chart-selector" v-else-if="chartSelected === 1">
      <div class="whole_container">
        <p class="picture_title">
          {{ title_of_rain }}
        </p>
        <div class="pic_container">
          <immersive-picture :src="imgSrc_of_rain" />
        </div>
        <el-button ref="buttonLeftRain" type="primary" class="arrow-left" :icon="ArrowLeft"
          @click="change_time_rain('left')"></el-button>
        <el-button ref="buttonRightRain" type="primary" class="arrow-right" :icon="ArrowRight"
          @click="change_time_rain('right')"></el-button>
      </div>
    </div>

    <div class="chart-selector" v-else-if="chartSelected === 2">
      <div class="whole_container">
        <p class="picture_title">
          {{ title_of_wind }}
        </p>
        <div class="pic_container">
          <immersive-picture :src="imgSrc_of_wind" />
        </div>
        <el-button ref="buttonLeftWind" type="primary" class="arrow-left" :icon="ArrowLeft"
          @click="change_time_wind('left')"></el-button>
        <el-button ref="buttonRightWind" type="primary" class="arrow-right" :icon="ArrowRight"
          @click="change_time_wind('right')"></el-button>
      </div>
      <div>
        <p></p>
      </div>
      <div class="whole_container">
        <p class="picture_title">
          {{ title_of_wind2 }}
        </p>
        <div class="pic_container">
          <immersive-picture :src="imgSrc_of_wind2" />
        </div>
        <el-button ref="buttonLeftWind2" type="primary" class="arrow-left" :icon="ArrowLeft"
          @click="change_time_wind2('left')"></el-button>
        <el-button ref="buttonRightWind2" type="primary" class="arrow-right" :icon="ArrowRight"
          @click="change_time_wind2('right')"></el-button>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">
/*时间选择器样式*/
.datetime-picker {
  float: right;
  display: flex;
  width: 25%;
  padding: 0;
  flex-direction: column-reverse;
  /* 设置为列方向，同时将内容从底部开始排列 */
}

/* 为demonstration添加样式 */
.datetime-picker .demonstration {
  display: inline-block;
  white-space: nowrap;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 0;
  /* 调整为0，使文字紧贴上方 */
}

.datetime-picker .block {
  padding: 20px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.datetime-picker .block:last-child {
  border-right: none;
}

.datetime-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}

.datePickerContainer {
  /* 其他样式 */
  display: flex;
  justify-content: flex-end;
  position: relative;
  padding: 50px 0 30px;
}

.el-tabs {
  width: 100%;
  /* 占满父容器的宽度 */
}

.tabs-container {
  width: 100%;
  /* 占满父容器的宽度 */
  display: flex;
  justify-content: center;
  /* 在容器中水平居中 */
}

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
  //color:#ffffff;
  color: rgb(251, 236, 222);
}

.picture_title {
  text-align: center;
  font-size: 22px;
}

// .picture {
//   width: 100%;
//   height: auto;
//   object-fit: cover;
// }

.pic_container {
  display: flex;
  height: 60vh;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
}

/* 预报误差页面的容器 */
.whole_container {
  position: relative;
  width: 100%;
}

/* 新版添加的代码 =====================================================*/
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
  /* 确保图片在文字下方 */
  object-position: 50% -35px;
  /* 水平居中，垂直向上偏移20px */
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

/*chart1、2 的表和文字*/
.chart {
  height: 500px;
}

.text_of_graph {
  text-align: center;
  font-size: 23px;
}

.text3 {
  text-align: center;
}

.text4 {
  text-align: center;
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