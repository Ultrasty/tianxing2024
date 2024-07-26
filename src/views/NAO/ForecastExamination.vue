<script setup>

import axios from "axios";
import {ref} from "vue";
//import {ArrowLeft, ArrowRight} from "@element-plus/icons-vue";
//import VChart from "vue-echarts";

//时间选择器范围框定--start
const start_year = ref(null);
const start_month = ref(null);
const end_year = ref(null);
const end_month = ref(null);

//const selectedDateTime = ref(null);
const selectedYear = ref(''); // 新变量，用于存储选定的年份
const selectedMonth = ref(''); // 新变量，用于存储选定的月份

const date = new Date(2021,11,1,0,0,0);
const year = date.getFullYear() + '';
const month = date.getMonth() < 10 ? '0' + (date.getMonth() + 1 + '') : date.getMonth() + 1 + ''
//selectedDateTime.value = date;
// const year = date.getFullYear();
// const month = date.getMonth() + 1;

selectedYear.value = year;
selectedMonth.value = month;



axios.get('/nao/initialize/naoCORR')
.then(res =>{
  start_year.value = res.data.start_year;
  start_month.value = new Date(res.data.start_month);
  end_year.value = res.data.end_year;
  end_month.value = new Date(res.data.end_month);
});

const limitedDateRange = (time) => {
  return time.getFullYear() < start_year.value || time.getFullYear() > end_year.value;
};

// const limitedDateRange = (time) => {
//   return time.getFullYear() < 2015  || time.getFullYear() > 2021 ;
// };

const text_of_option1 = ref('预测误差主要来自于对中纬度和冰岛附近低压的高估，能够预测出NAO的典型两级模态 ，模拟误差随着预测时长逐渐增加。')//表示前六个图底下的文字描述

const text_of_option7 = ref('对于为期1个月的NAOI预测，不如高分辨率模式ECMWF ，但与低分辨率模式ECCC相当。由于只接受月平均数作为输入，忽略了决定短时尺度可预测性的天气现象和初始条件。在超过两个月的提前期的预测技巧远远超过了失去预测能力的数值模式，将NAO的有效预测时间从1个月扩展到了6个月。')

//const selectedYear = ref('');
//const selectedMonth = ref('');




//selectedYear.value = year;
//selectedMonth.value = month;

var index_nao=0; //切换气温预测时修改这个索引
var imgSrc_of_nao_Array;
var title_of_nao_Array;
const imgSrc_of_nao = ref({})
const title_of_nao = ref({})
const prefix="https://tianxing.tongji.edu.cn"

const option7 = ref({})

function updateChartTitle() {
  axios.get('/nao/predictionExamination/nao?year='+Number(selectedYear.value)+'&month='+Number(selectedMonth.value))
  //axios.get("/nao/findGridData/nao?year=2018&month=6")
      .then(res => {
        index_nao = 0;
        console.log(res.data);
        imgSrc_of_nao_Array = res.data;
        imgSrc_of_nao.value = `${prefix}${imgSrc_of_nao_Array[0]}`;
      });
  

}


axios.get('/nao/predictionExamination/nao?year='+Number(selectedYear.value)+'&month='+Number(selectedMonth.value))
  //axios.get("/nao/findGridData/nao?year=2018&month=6")
      .then(res => {
        index_nao = 0;
        console.log(res.data);
        imgSrc_of_nao_Array = res.data;
        imgSrc_of_nao.value = `${prefix}${imgSrc_of_nao_Array[0]}`;
      });
axios.get('/nao/predictionExamination/naoi')
    .then(res => {
      console.log(res.data);
      option7.value = res.data;
  });

function change_time_nao(flag) {

if(flag==="left"){
  if(index_nao>0){
    index_nao--;
  }
  else{
    index_nao=5;
  }
}
else if(flag==="right"){
  if(index_nao<5){
    index_nao++;
  }
  else{
    index_nao=0;
  }
}
title_of_nao.value=title_of_nao_Array[index_nao];
imgSrc_of_nao.value=`${prefix}${imgSrc_of_nao_Array[index_nao]}`;
//text_of_temperature.value=text_of_temperature_Array[index_tempe];
}



</script>

<template>
  <div class="pageContent">
    <h1 class="title">
      NAO预测结果检验
    </h1>
    <div class="datePickerContainer">
      <el-date-picker @change="updateChartTitle" v-model="selectedYear" 
      :disabledDate="limitedDateRange"
      type="year" format="YYYY" value-format="YYYY" :clearable="false"  style="width: 80px; height: 25px"/>
      <div class="text">年</div>
      <el-date-picker @change="updateChartTitle" v-model="selectedMonth"
      :disabledDate="limitedDateRange"
      type="month" format="MM" value-format="MM" :clearable="false" style="width: 60px; height: 25px"/>
      <div class="text">月</div>

    </div>    
    <el-tabs type="border-card" :stretch="true">
      <el-tab-pane label="指数预测">
        <h2 class="title">
          {{ selectedYear }}年{{ selectedMonth }}月 预测结果分布误差图
        </h2>

        <div class="whole_container">

            <div class="pic_container">
              <img class="picture" :src="imgSrc_of_nao" alt="">
            </div>
            <!-- <p class="picture_text">
              {{ text_of_temperature }}
            </p> -->
            <!-- <el-button type="primary" class="arrow-left" :icon="ArrowLeft" @click="change_time_nao('left')"></el-button>
            <el-button type="primary" class="arrow-right" :icon="ArrowRight" @click="change_time_nao('right')"></el-button> -->
            <div class="description">
            {{ text_of_option1 }}
            </div>  
          </div>

      </el-tab-pane>
      <el-tab-pane label="模态预测" style="min-height: 350px">
        <h2 class="title">
           NAOI指数预测的相关系数
        </h2>
        <div class="chart">
          <v-chart :option="option7" autoresize></v-chart>
        </div>   
        <div class="description1">
          {{ text_of_option7 }}
        </div>
      </el-tab-pane>
     
    </el-tabs>
  </div>
</template>





<style scoped lang="scss">
  .title {
    text-align: center
  }
  .chart {
    height: 500px;
  }

  .description {
    text-align: center;
    font-size: 16px;
    margin-left: 10px;
  }
  .description1 {
    //text-align: center;
    font-size: 16px;
    margin-left: 10px;
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
  .picture_title {
   text-align: center;
   font-size: 14px;
}

  .picture {
  max-width: 100%;
  display: flex; /* 将元素设置为块级元素 */
  justify-content:center;
  //margin-left: 3%;
   margin-top: 0px;
  // margin-bottom: -160px;
}
.whole_container {
  //position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.pic_container{
  overflow: hidden;
  display: flex;
  justify-content: center;
}
// /* 设置左箭头按钮的样式 */
// .el-button.arrow-left {
//   position: absolute;
//   top: 50%; /* 将箭头按钮的顶部与父容器的中间对齐 */
//   left: 0; /* 将箭头按钮的左侧与父容器的左侧对齐 */
//   width: 40px; /* 设置按钮宽度 */
//   height: 80px; /* 设置按钮高度 */
//   transform: translateY(-50%); /* 垂直居中箭头按钮 */
// }

// /* 设置右箭头按钮的样式 */
// .el-button.arrow-right {
//   position: absolute;
//   top: 50%; /* 将箭头按钮的顶部与父容器的中间对齐 */
//   right: 0; /* 将箭头按钮的右侧与父容器的右侧对齐 */
//   width: 40px; /* 设置按钮宽度 */
//   height: 80px; /* 设置按钮高度 */
//   transform: translateY(-50%); /* 垂直居中箭头按钮 */
// }

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
