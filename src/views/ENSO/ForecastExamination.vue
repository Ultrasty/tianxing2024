<script setup>
import { ref, onMounted, reactive, watch, defineExpose, computed } from "vue";
import * as echarts from "echarts";
import axios from "axios";
import VChart from 'vue-echarts';
import { nextTick } from "vue";
import { configProviderContextKey } from "element-plus";
/* 时间选择器 -- begin */
const currentDate = ref(new Date('2023-2'));   //  赋初值
const start_year = computed(() => {
  return currentDate.value.getFullYear();
});
const start_month = computed(() => {
  return currentDate.value.getMonth() + 1;
});

const start_time = ref(null);     //可选时间范围
const end_time = ref(null);
//此处利用monthly comparison调接口获取未切换标签时的时间范围
axios.get('/enso/monthlyComparison/getInitData')
  .then(res => {
    //console.log(res.data.start);
    start_time.value = new Date(res.data.start);
    end_time.value = new Date(res.data.end);
  });

// start_time.value = new Date('2023-1');      //暂时写死范围
// end_time.value = new Date('2023-6');
const limitedDateRange = (time) => {
  return time.getTime() < start_time.value || time.getTime() > end_time.value;
};
/* 根据选择页更新限制范围 ！！为了适应新版前端已经更改！！*/
function handleClick(chartName, index) {
  chartSelected.value = index;

  console.log(chartName);
  if (chartName == '逐月比对') {
    //再次调用接口是为了当从别的标签切换回来时 能将时间选择器对应修改
    axios.get('/enso/monthlyComparison/getInitData')
      .then(res => {
        start_time.value = new Date(res.data.start.replace(/-/g, '/'));
        end_time.value = new Date(res.data.end.replace(/-/g, '/'));
      });
  }
  else if (chartName == '预报误差') {
    //再次调用接口是为了当从别的标签切换回来时 能将时间选择器对应修改
    axios.get('/enso/monthlyComparison/getInitData')
      .then(res => {
        start_time.value = new Date(res.data.start.replace(/-/g, '/'));
        end_time.value = new Date(res.data.end.replace(/-/g, '/'));
      });
  }
  else if (chartName == '误差分析') {
    axios.get('/enso/errorBox/getInitData')
      .then(res => {
        //console.log(res.data.earliestDate);
        //console.log(res.data.latestDate);
        start_time.value = new Date(res.data.earliestDate.replace(/-/g, '/'));
        end_time.value = new Date(res.data.latestDate.replace(/-/g, '/'));
        //console.log(start_time.value);
        //console.log(end_time.value);
      });
    // start_time.value = new Date('2023-2');
    // end_time.value = new Date('2023-2');
  }
  else {        //相关系数
    axios.get('/enso/errorCorr/getInitData')
      .then(res => {
        console.log(res.data.earliestDate);
        console.log(res.data.latestDate);
        start_time.value = new Date(res.data.earliestDate.replace(/-/g, '/'));
        end_time.value = new Date(res.data.latestDate.replace(/-/g, '/'));
      });
  }
}
/* 时间选择器 -- end */

var chart2_option; //存储从后端返回的chart2的option
var index_month = 0; //切换页时修改这个索引

const chart1 = ref({})
const chart2 = ref({})
const chart3 = ref({})
const chart4 = ref({})
/* chart1 ,chart2 的下方文字描述 */
let Chart1_Description = reactive({ single: true, text: '此处为预测结果汇总折线图。' })
let Chart2_Description = reactive({ single: true, text: '此处的12副图分别为从2022年2月~2023年1月起报的预测结果、官方记录结果及二者绝对差值图（柱状）。' })
/* chart3 ,chart4 的下方文字描述 */
let Chart3_Description = reactive({ single: true, text: '此处为不同起报月份的绝对差值分布箱型图。' })
let Chart4_Description = reactive({ single: true, text: '此处为不同起报月份的相关性折线图。' })


/* 赋初值 */
//逐月对比
axios.get('/enso/predictionExamination/monthlyComparison?year=' + Number(start_year.value) + '&month=' + Number(start_month.value))
  .then(res => {
    chart1.value = res.data.option;
    Chart1_Description.text = res.data.text
  });
//预报误差
axios.get('/enso/predictionExamination/error?year=' + Number(start_year.value) + '&month=' + Number(start_month.value))
  .then(res => {
    chart2_option = res.data.option;
    chart2.value = chart2_option[0];
    Chart2_Description.text = res.data.text;
  });
//误差分析
axios.get('/enso/predictionExamination/errorBox?year=' + Number(start_year.value) + '&month=' + Number(start_month.value))
  .then(res => {
    chart3.value = res.data.option
    Chart3_Description.text = res.data.text
  });
//相关系数
axios.get('/enso/predictionExamination/errorCorr?year=' + Number(start_year.value) + '&month=' + Number(start_month.value))
  .then(res => {
    chart4.value = res.data.option
    Chart4_Description.text = res.data.text
  });

/* 图表更新 */
function update_charts() {
  //使元素失去焦点
  document.activeElement.blur();

  axios.get('/enso/predictionExamination/monthlyComparison?year=' + Number(start_year.value) + '&month=' + Number(start_month.value))
    .then(res => {
      chart1.value = res.data.option
      Chart1_Description.text = res.data.text
    });
  axios.get('/enso/predictionExamination/error?year=' + Number(start_year.value) + '&month=' + Number(start_month.value))
    .then(res => {
      chart2_option = []; //先置空
      index_month = 0; //设置索引月为0
      chart2_option = res.data.option;
      chart2.value = chart2_option[0];
      Chart2_Description.text = res.data.text
    });
  axios.get('/enso/predictionExamination/errorBox?year=' + Number(start_year.value) + '&month=' + Number(start_month.value))
    .then(res => {
      chart3.value = res.data.option
      Chart3_Description.text = res.data.text
    });
  axios.get('/enso/predictionExamination/errorCorr?year=' + Number(start_year.value) + '&month=' + Number(start_month.value))
    .then(res => {
      chart4.value = res.data.option
      Chart4_Description.text = res.data.text
    });
}

const buttonLeft = ref(null);
const buttonRight = ref(null);

/* chart2左右切换 -- begin */
function change_Month(flag) {

  if (flag === "left") {
    if (index_month > 0) {
      index_month--;
    }
    else {
      index_month = 11;
    }
    buttonLeft.value.$el.blur();
  }
  else if (flag === "right") {
    if (index_month < 11) {
      index_month++;
    }
    else {
      index_month = 0;
    }
    buttonRight.value.$el.blur();
  }

  chart2.value = chart2_option[index_month];
}
/* chart2左右切换 -- end */

defineExpose({
  change_Month
});

/* 新版添加的代码========================================================== */
import bannerImg from '@/assets/header.jpg';


const chartSelected = ref(0);

const chartNames = ['逐月比对', '预报误差', '误差分析', '相关系数'];

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
      <h3 class="title">ENSO预测结果检验</h3>
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
    <div style="margin: 0 10%">
      <div class="text-container" v-if="chartSelected === 0">
        <p class="text_of_graph">{{ Chart1_Description.text }}</p>
      </div>
      <div class="text-container" v-if="chartSelected === 1">
        <p class="text_of_graph">{{ Chart2_Description.text }}</p>
      </div>
      <div class="text-container" v-if="chartSelected === 2">
        <p class="text_of_graph">{{ Chart3_Description.text }}</p>
      </div>
      <div class="text-container" v-if="chartSelected === 3">
        <p class="text_of_graph">{{ Chart4_Description.text }}</p>
      </div>

      <div class="datePickerContainer">
        <el-date-picker @change="update_charts()" v-model="currentDate" type="month" :clearable="false"
          :disabledDate="limitedDateRange" />
      </div>
    </div>
    <div class="chart-selector" v-if="chartSelected === 0">
      <v-chart class="chart1" :option="chart1" autoresize></v-chart>
    </div>

    <div class="chart-selector-with-button" v-else-if="chartSelected === 1">
      <v-chart class="chart" :option="chart2" autoresize></v-chart>
      <el-button ref="buttonLeft" type="primary" class="arrow-left" :icon="ArrowLeft"
        @click="change_Month('left')"></el-button>
      <el-button ref="buttonRight" type="primary" class="arrow-right" :icon="ArrowRight"
        @click="change_Month('right')"></el-button>
    </div>

    <div class="chart-selector" v-else-if="chartSelected === 2">
      <v-chart class="chart" :option="chart3" autoresize></v-chart>
    </div>


    <div class="chart-selector" v-else-if="chartSelected === 3">
      <v-chart class="chart" :option="chart4" autoresize></v-chart>
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
  position: relative;
  padding: 50px 0 30px;
}

.text {
  margin-left: 5px;
  margin-right: 10px;
}

/*chart1、2 的表和文字*/
.chart1 {
  height: 50vh;
  min-height: 700px;
}

.chart {
  height: 50vh;
  min-height: 500px;
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