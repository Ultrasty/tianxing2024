<script setup>
import { ref, onMounted, reactive, watch, defineExpose, computed } from "vue";
import * as echarts from "echarts";
import axios from "axios";
import VChart from 'vue-echarts';
import { nextTick } from "vue";
import { configProviderContextKey } from "element-plus";

const prefix = "https://tianxing.tongji.edu.cn"

//时间选择器范围框定--start
const start_time = ref(null);
const end_time = ref(null);
/* 赋初值————默认为指数预测 */
axios.get('/enso/linechart/getInitData')
  .then(res => {
    start_time.value = new Date(res.data.earliestDate.replace(/-/g, '/'));
    end_time.value = new Date(res.data.latestDate.replace(/-/g, '/'));
  });

const limitedDateRange = (time) => {
  return time.getTime() < start_time.value || time.getTime() > end_time.value;
};

/* 根据选择页更新限制范围 */
function handleClick(chartName, index) {
  chartSelected.value = index;
  console.log(chartName);
  if (chartName == '模态预测') {
    axios.get('/imgs/predictionResult/ssta/getInitData')
      .then(res => {
        start_time.value = new Date(res.data.start.replace(/-/g, '/'));
        end_time.value = new Date(res.data.end.replace(/-/g, '/'));
      });
  }
  else if (chartName == '指数预测') {
    axios.get('/enso/linechart/getInitData')
      .then(res => {
        start_time.value = new Date(res.data.earliestDate.replace(/-/g, '/'));
        end_time.value = new Date(res.data.latestDate.replace(/-/g, '/'));
      });
  }

}
//时间选择器范围框定--end

const currentDate = ref(new Date('2023-2'));   //  赋初值
const start_year = computed(() => {
  return currentDate.value.getFullYear();
});
const start_month = computed(() => {
  return currentDate.value.getMonth() + 1;
});


// 此处调接口获取时间范围
axios.get('/imgs/predictionResult/ssta/getInitData')
  .then(res => {
    start_time.value = new Date(res.data.start.replace(/-/g, '/'));
    end_time.value = new Date(res.data.end.replace(/-/g, '/'));
  });

const chart1 = ref({})
const chart1Title = ref('**年*月~**年*月Niño3.4指数结果预测')
let Chart1_Description = reactive({ single: true, text: '此处为预测结果指数预测折线图。' })

var index_heat = 0; //切换热力图时修改这个索引
var imgSrc_of_heat_Array;
var title_of_heat_Array;

const imgSrc_of_heat = ref({})
const title_of_heat = ref({})

/* 赋初值 */
//指数预测
axios.get('/enso/predictionResult/linechart?year=' + Number(start_year.value) + '&month=' + Number(start_month.value))
  .then(res => {
    chart1.value = res.data

  });

//模态预测（热力图）
axios.get('/imgs/predictionResult/ssta?year=' + Number(start_year.value) + '&month=' + Number(start_month.value))
  .then(res => {
    index_heat = 0;//图片数组指针置0
    console.log(res.data.data);
    imgSrc_of_heat_Array = res.data.data;  //res.data.data传递了一个图片数组
    imgSrc_of_heat.value = `${prefix}${imgSrc_of_heat_Array[0]}`;    //const prefix="https://tianxing.tongji.edu.cn"

    title_of_heat_Array = res.data.titles;
    title_of_heat.value = title_of_heat_Array[0];

  });

/* 图表更新 */
function update_charts() {
  //使元素失焦
  document.activeElement.blur();

  // 当日期时间选择发生变化时被调用

  console.log(start_month.value); // 输出当前选择的日期和时间
  console.log(start_year.value);

  start_month.value = start_month.value;
  start_month.value = start_month.value;

  axios.get('/enso/predictionResult/linechart?year=' + Number(start_year.value) + '&month=' + Number(start_month.value))
    .then(res => {
      chart1.value = res.data
    })
  axios.get('/imgs/predictionResult/ssta?year=' + Number(start_year.value) + '&month=' + Number(start_month.value))
    .then(res => {
      index_heat = 0;//图片数组指针置0
      console.log(res.data.data);
      imgSrc_of_heat_Array = res.data.data;  //res.data.data传递了一个图片数组
      imgSrc_of_heat.value = `${prefix}${imgSrc_of_heat_Array[0]}`;    //const prefix="https://tianxing.tongji.edu.cn"

      title_of_heat_Array = res.data.titles;
      title_of_heat.value = title_of_heat_Array[0];

    });
}

/* 使el-button点击后能正常失焦 Start (by wyf)*/
const buttonLeft = ref(null);
const buttonRight = ref(null);

/* 左右切换 -- begin */
function change_time_heat(flag) {
  if (flag === "left") {
    if (index_heat > 0) {
      index_heat--;
    }
    else {
      index_heat = 17;
    }
    buttonLeft.value.$el.blur();
  }
  else if (flag === "right") {
    if (index_heat < 17) {
      index_heat++;
    }
    else {
      index_heat = 0;
    }
    buttonRight.value.$el.blur();
  }
  imgSrc_of_heat.value = `${prefix}${imgSrc_of_heat_Array[index_heat]}`;
  title_of_heat.value = `${title_of_heat_Array[index_heat]}`;
}

defineExpose({
  change_time_heat
});
/* 使el-button点击后能正常失焦 End */

/* 新版添加的代码========================================================== */
import bannerImg from '@/assets/header.jpg';
import ImmersivePicture from "../user/ImmersivePicture.vue";

const chartSelected = ref(0);

const chartNames = ['指数预测', '模态预测'];

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


/* 新版代码END============================================================ */

import {
  ArrowLeft,
  ArrowRight,
} from '@element-plus/icons-vue'
</script>

<template>
  <div class="pageContent">
    <div class="banner">
      <img :src="bannerImg" />
      <h3 class="title">ENSO预测结果</h3>
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


    <div>
      <p></p>
    </div>
    <div style="margin: 0px 10%;">

    <div class="text-container" v-if="chartSelected === 0">
      <p class="text_of_graph">{{ Chart1_Description.text }}</p>
    </div>
    <!-- <div class="text-container" v-if="chartSelected === 1">
      <p class="text_of_graph">{{ Chart2_Description.text }}</p>
    </div> -->


    <div class="datePickerContainer">
      <el-date-picker @change="update_charts()" v-model="currentDate" type="month" :clearable="false"
        :disabledDate="limitedDateRange" />
    </div>

    </div>
    
    <div class="chart-selector" v-if="chartSelected === 0">
      <v-chart class="chart_1" :option="chart1" autoresize> </v-chart>
    </div>


    <div class="chart-selector" v-else-if="chartSelected === 1">
    <div style="margin: 0px 10%;">
      <p class="picture_title">
        {{ title_of_heat }}
      </p>
      <div class="pic_container">
        <immersive-picture :src="imgSrc_of_heat" />
      </div>
      <el-button ref="buttonLeft" type="primary" class="arrow-left" :icon="ArrowLeft"
        @click="change_time_heat('left')"></el-button>
      <el-button ref="buttonRight" type="primary" class="arrow-right" :icon="ArrowRight"
        @click="change_time_heat('right')"></el-button>
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
  letter-spacing: 1px;
  /* 字符间距 */

  z-index: 1;
  /* 确保图片在文字下方 */
  color: #ffffff;

}

.datePickerContainer {
  display: flex;
  justify-content: flex-end;
  position:relative;
  padding:50px 0 30px;
}

.text {
  margin-left: 5px;
  margin-right: 10px;
}

/*chart1、2 的表和文字*/
.chart {
  height: 400px;
}

.text_of_graph {
  text-align: center;
  font-size: 23px;
}

/* 预报误差页面的容器 没用了*/
// .chart-container {
//   size: 100%
// }



/* 新版添加的代码 =====================================================*/
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

.chart-selector {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px 0%;
  margin: 0px 0%;
}

.chart-name-selected {
  color: blue;
}

//图表样式
.chart_1 {
  height: 50vh;
  min-height: 400px;
}

.picture {
  width: 100%;
  display: block;
  /* 将元素设置为块级元素 */
  max-width: 100%;
  /* 确保图片不会超出父容器 */
  height: auto;
  /* 保持图片比例 */
  display: inline-block;
  /* 使图片可以与 text-align 一起使用 */
}

.pic_container {
  text-align: center;
  /* 使图片在容器内居中 */
  max-width: 100%;
  margin: 0% auto;
  overflow: hidden;
}

.picture_title {
  text-align: center;
  font-size: 18px;
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