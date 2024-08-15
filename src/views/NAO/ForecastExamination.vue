<script setup>
import { ref, onMounted, reactive, watch, defineExpose, computed } from "vue";
import * as echarts from "echarts";
import axios from "axios";
import VChart from 'vue-echarts';
import { nextTick } from "vue";
import { configProviderContextKey } from "element-plus";
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import bannerImg from '@/assets/header.jpg';//首页图
import ImmersivePicture from "../user/ImmersivePicture.vue";

const prefix = "https://tianxing.tongji.edu.cn"
// 新加入
const chartSelected = ref(0);
const chartNames = ['指数预测', '模态预测'];

//时间选择器范围框定--start
const start_year = ref(null);
const start_month = ref(null);
const end_year = ref(null);
const end_month = ref(null);

const selectedDateTime = ref(new Date('2015-1'));
const selectedYear = computed(() => {
  return selectedDateTime.value.getFullYear();
})
const selectedMonth = computed(() => {
  return selectedDateTime.value.getMonth() + 1;
})

axios.get('/nao/initialize/naoCORR')
  .then(res => {
    start_year.value = res.data.start_year;
    start_month.value = new Date(res.data.start_month);
    end_year.value = res.data.end_year;
    end_month.value = new Date(res.data.end_month);
    //console.log(res.data);
  })
  .catch(error => {
    console.error(error);
  });

const limitedDateRange = (time) => {
  return time.getFullYear() < start_year.value || time.getFullYear() > end_year.value;
};


const text_of_option1 = ref('预测误差主要来自于对中纬度和冰岛附近低压的高估，能够预测出NAO的典型两级模态 ，模拟误差随着预测时长逐渐增加。')//表示前六个图底下的文字描述
const text_of_option7 = ref('对于为期1个月的NAOI预测，不如高分辨率模式ECMWF ，但与低分辨率模式ECCC相当。由于只接受月平均数作为输入，忽略了决定短时尺度可预测性的天气现象和初始条件。在超过两个月的提前期的预测技巧远远超过了失去预测能力的数值模式，将NAO的有效预测时间从1个月扩展到了6个月。')


var index_nao = 0; //切换气温预测时修改这个索引
var imgSrc_of_nao_Array;
var title_of_nao_Array;
const imgSrc_of_nao = ref({})
const title_of_nao = ref({})

const option7 = ref({})

function updateChartTitle() {
  //使元素失焦
  document.activeElement.blur();

  axios.get('/nao/predictionExamination/nao?year=' + Number(selectedYear.value) + '&month=' + Number(selectedMonth.value))
    .then(res => {
      index_nao = 0;
      console.log("点击标签,更新nao", res.data);
      imgSrc_of_nao_Array = res.data;
      imgSrc_of_nao.value = `${prefix}${imgSrc_of_nao_Array[0]}`;
      //console.log("wwwww",imgSrc_of_nao_Array[0]);
    })
    .catch(error => {
      console.error(error);
    });

  axios.get('/nao/predictionExamination/naoi')
    .then(res => {
      console.log("更新naoi", res.data);
      // title_of_option1.value='提前1个月预测';
      // list = res.data.imgSrc;
      option7.value = res.data;
    })
    .catch(error => {
      console.error(error);
    });
}

//////////以下两个是初始化
axios.get('/nao/predictionExamination/nao?year=' + Number(selectedYear.value) + '&month=' + Number(selectedMonth.value))
  .then(res => {
    index_nao = 0;
    console.log("初始化nao", res.data);
    imgSrc_of_nao_Array = res.data;
    imgSrc_of_nao.value = `${prefix}${imgSrc_of_nao_Array[0]}`;
    //console.log("swwwww",imgSrc_of_nao_Array[0]);
  });

axios.get('/nao/predictionExamination/naoi')
  .then(res => {
    console.log("初始化naoi", res.data);
    // title_of_option1.value='提前1个月预测';
    // list = res.data.imgSrc;
    option7.value = res.data;
  });

function change_time_nao(flag) {

  if (flag === "left") {
    if (index_nao > 0) {
      index_nao--;
    }
    else {
      index_nao = 5;
    }
  }
  else if (flag === "right") {
    if (index_nao < 5) {
      index_nao++;
    }
    else {
      index_nao = 0;
    }
  }
  title_of_nao.value = title_of_nao_Array[index_nao];
  imgSrc_of_nao.value = `${prefix}${imgSrc_of_nao_Array[index_nao]}`;
  //text_of_temperature.value=text_of_temperature_Array[index_tempe];
}

//换成新的选项卡
function selectChart(index) {
  chartSelected.value = index;
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
  backgroundColor: "blue",
  transition: "left 0.3s ease"
}));
</script>

<template>
  <div class="pageContent">
    <div class="banner">
      <img :src="bannerImg" />
      <h3 class="title">NAO预测结果检验</h3>
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



    <div style="margin: 0px 10%;">

      <div class="datePickerContainer">
        <el-date-picker @change="updateChartTitle()" v-model="selectedDateTime" type="month" :clearable="false"
          :disabledDate="limitedDateRange" />
      </div>

      <div class="text-container" v-if="chartSelected === 0">
        <div class="description">
          {{ text_of_option1 }}
        </div>
      </div>

      <div class="text-container" v-if="chartSelected === 1">
        <div class="description1">
          {{ text_of_option7 }}
        </div>
      </div>
    </div>

    <div>
      <p></p>
    </div>

    <div class="chart-selector" v-if="chartSelected === 1">
      <h2 class="chart-title">
        NAOI指数预测的相关系数
      </h2>
      <div class="chart">
        <v-chart :option="option7" autoresize></v-chart>
      </div>
    </div>

    <div class="chart-selector" v-else-if="chartSelected === 0">
      <h2 class="chart-title">
        {{ selectedYear }}年{{ selectedMonth }}月 预测结果分布误差图
      </h2>
      <div class="whole_container">
        <div style="margin: 0 10%;">
          <div class="pic_container">
            <immersive-picture :src="imgSrc_of_nao" />
          </div>
        </div>
        <!-- <el-button ref="buttonLeft" type="primary" class="arrowLeft" :icon="ArrowLeft"
            @click=" change_time_nao('left')"></el-button>
          <el-button ref="buttonRight" type="primary" class="arrowRight" :icon="ArrowRight"
            @click=" change_time_nao('right')"></el-button> -->
        <!-- </div> -->
      </div>


    </div>
</template>

<style scoped lang="scss">
.chart-title {
  text-align: center;
  margin-top: 0px;
  font-size: 18px;
}

.title {
  //font-family: 'FangSong', sans-serif;
  //font-family: 'STKaiti';
  //font-family: 'SimSun';
  font-family: 'STXinwei';

  font-weight: 300; //调整字体粗细
  text-align: center;
  font-size: 55px;
  margin-left: 20%;
  //text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* 添加阴影 */
  //text-shadow: 1px 1px 2px #000, 0 0 25px blue, 0 0 5px darkblue;
  //webkit-text-stroke: 1px black; /* 文字描边 */
  letter-spacing: 1px;
  /* 字符间距 */

  z-index: 1;
  /* 确保图片在文字下方 */
  color: #ffffff;
}

.chart {
  height: 500px;
  background-color: white;
}

.datePickerContainer {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  padding-right: 15%;
  padding-top: 50px;
}

.text {
  margin-left: 5px;
  margin-right: 10px;
}

.picture_title {
  text-align: center;
  font-size: 14px;
}

.chart {
  width: 100%;
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
  margin-left: 10px;
}

.description1 {
  text-align: center;
  font-size: 23px;
  margin-left: 10px;
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

.picture_title {
  text-align: center;
  font-size: 14px;
}

.picture {
  min-width: 100%;
  display: block;
  /* 将元素设置为块级元素 */
  /* 确保图片不会超出父容器 */
  // height: auto;
  /* 保持图片比例 */
  /* 使图片可以与 text-align 一起使用 */
  background-color: white;
  /* 圆角 */
  border-radius: 8px;
  /* 阴影 */
  box-shadow: 0px 0px 10px 1.5px rgba(199, 198, 198, 0.893);
  padding-top: 20px;
  padding-bottom: 20px;
}

.whole_container {
  // position: relative;
  display: block;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 0;
  padding: 0 0;
}

.pic_container {
  overflow: hidden;
  display: block;
  justify-content: center;
  padding: 0px 0%;
  margin: 0px 0%;
}

//以下新加代码
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

ul.menu li:hover::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(240, 240, 240, 0.8);
  /* 浅灰色 */
  border-radius: 10px;
  /* 确保形状与选项卡一致 */
  pointer-events: none;
  /* 确保伪元素不影响鼠标事件 */
  z-index: 1;
  /* 确保覆盖层在文字和内容下方 */
}

ul.menu li:hover p {
  color: rgb(255, 89, 0);
  z-index: 2;
  /* 确保文字在覆盖层之上 */
}

.mov-box {
  position: absolute;
  z-index: 3;
  /* 确保滑动条在覆盖层之上 */
}

.chart-name-selected {
  color: blue;
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