<script setup>

import { ref, onMounted, computed } from "vue";
import VChart from 'vue-echarts'
import axios from 'axios';
import bannerImg from '@/assets/Ice.jpg';

const selectedTime = ref(new Date('2023-01'));

const selectedYear = computed(() => {
  return selectedTime.value.getFullYear();
})
const selectedMonth = computed(() => {
  return selectedTime.value.getMonth() + 1;
})
const selectedDay = computed(() => { return selectedTime.value; });

const start_year1 = ref(null);
const start_month1 = ref(null);
const start_year2 = ref(null);
const start_month2 = ref(null);
const start_year3 = ref(null);
const start_month3 = ref(null);

const start_year = ref(2023);     //可选时间范围
const end_year = ref(2023);
const start_month = ref(1);     //可选时间范围
const end_month = ref(1);

const chartSelected = ref(0);
const chartNames = ['SIC日预测误差', 'SIC误差统计', 'SIE误差分析'];

const moveBoxLeft = computed(() => chartSelected.value * 250);
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

const limitedDateRange = (time) => {
  return time.getFullYear() < start_year.value || time.getFullYear() > end_year.value;
};
const limitedDateRange2 = (time) => {
  return ((time.getFullYear() < start_year.value || time.getFullYear() > end_year.value) && (time.getMonth() >= 0 && time.getMonth() <= 11)) || ((time.getFullYear() >= start_year.value && time.getFullYear() <= end_year.value) && ((time.getMonth() >= end_month.value && time.getMonth() <= 11)));
};


const SICChartErroPrediction = ref('这张图显示了2023年1月的4周SIC预测结果与基线方法的比较。预测结果始终优于persistence，在第28天，预测结果比persistence的RMSE低26.48%，证明了预测结果的有效性。')

const SICChartErroAdd = ref('这张图显示了2022年里四种SIC预测结果提前1到7天的统计结果。MITgcm output (with DA) with BC显著降低了SIC的预测误差，RMSE一直低于0.09，更好地提高了SIC预报结果准确性。')

const SIEChartErroAnalyse = ref('rmsd用来分析预报误差成因，其由偏差与方差两部分组成。从图b可以看出，除2020与2022年春季外，其他年份季节的rmsd主要由偏差构成，而从图d可知，当预报与观测之间的标准差偏差大时，对应了偏差的大值部分。而对于2020年与2022年春季的rmsd主要由方差构成，对应图c可知，当预报相关性系数较低时会造成较大的方差。')


const chartTitle = ref('')
chartTitle.value = `${selectedYear.value}年${selectedMonth.value}月 预测结果误差折线图`
//chartTitle.value = `2023年1月预测结果误差折线图`


const chartTitle2 = ref('')
chartTitle2.value = `${selectedYear.value}年${selectedMonth.value}月~${Number(selectedYear.value) + 1 + ''}年${selectedMonth.value}月 预测结果误差折线图`

const chartTitle3 = ref('')
chartTitle3.value = `${selectedYear.value}年SIC回报结果误差箱型图`

const chartTitle4 = ref('')
chartTitle4.value = `SIE预测误差分析`

const option1 = ref({})
const option2 = ref({})
const option3 = ref({})
const option4 = ref({})
const option5 = ref({})
const option6 = ref({})
const option7 = ref({})


const chartX = ref('')
const chartX1 = ref('')
chartX.value = [`${selectedYear.value}/${selectedMonth.value}/1`, `${selectedYear.value}/${selectedMonth.value}/2`, `${selectedYear.value}/${selectedMonth.value}/3`,
`${selectedYear.value}/${selectedMonth.value}/4`, `${selectedYear.value}/${selectedMonth.value}/5`, `${selectedYear.value}/${selectedMonth.value}/6`,
`${selectedYear.value}/${selectedMonth.value}/7`, `${selectedYear.value}/${selectedMonth.value}/8`, `${selectedYear.value}/${selectedMonth.value}/9`,
`${selectedYear.value}/${selectedMonth.value}/10`, `${selectedYear.value}/${selectedMonth.value}/11`, `${selectedYear.value}/${selectedMonth.value}/12`,
`${selectedYear.value}/${selectedMonth.value}/13`, `${selectedYear.value}/${selectedMonth.value}/14`, `${selectedYear.value}/${selectedMonth.value}/15`,
`${selectedYear.value}/${selectedMonth.value}/16`, `${selectedYear.value}/${selectedMonth.value}/17`, `${selectedYear.value}/${selectedMonth.value}/18`,
`${selectedYear.value}/${selectedMonth.value}/19`, `${selectedYear.value}/${selectedMonth.value}/20`, `${selectedYear.value}/${selectedMonth.value}/21`,
`${selectedYear.value}/${selectedMonth.value}/22`, `${selectedYear.value}/${selectedMonth.value}/23`, `${selectedYear.value}/${selectedMonth.value}/24`,
`${selectedYear.value}/${selectedMonth.value}/25`, `${selectedYear.value}/${selectedMonth.value}/26`, `${selectedYear.value}/${selectedMonth.value}/27`,]

chartX1.value = [`${selectedYear.value - 2}spring`, `${selectedYear.value - 2}summer`, `${selectedYear.value - 2}fall`, `${selectedYear.value - 2}winter`,
`${selectedYear.value - 1}spring`, `${selectedYear.value - 1}summer`, `${selectedYear.value - 1}fall`, `${selectedYear.value - 1}winter`,
`${selectedYear.value}spring`, `${selectedYear.value}summer`, `${selectedYear.value}fall`, `${selectedYear.value}winter`
]

const updateTab1 = () => {
  axios.get('/seaice/error?year=' + Number(selectedYear.value) + '&month=' + Number(selectedMonth.value))
    .then(response => {
      console.log(response.data);
      option1.value = {
        title: {
          text: chartTitle.value,
          left: 'center' //标题水平居中
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          name: '时间',
          data: chartX.value
        },
        yAxis: {
          type: 'value',
          name: 'BACC(%)',
          data: [10, 12, 14, 16, 18]
        },
        legend: { //图例
          data: ['ours', 'persistence'],
          orient: 'horizontal',
          left: 'center',
          bottom: '5',
        },
        series: [
          {
            name: 'ours',
            type: 'line',
            data: response.data["2023_BACC"],

          },
          {
            name: 'persistence',
            type: 'line',
            data: response.data["2023_per_BACC"],
          },

        ]
      }

      option2.value = {
        tooltip: {},
        xAxis: {
          type: 'category',
          name: '时间',
          data: chartX.value
        },
        yAxis: {
          type: 'value',
          name: 'RMSE(%)',
          data: [10, 12, 14, 16, 18]
        },
        legend: { //图例
          data: ['ours', 'persistence'],
          orient: 'horizontal',
          left: 'center',
          bottom: '5',
        },
        series: [
          {
            name: 'ours',
            type: 'line',
            data: response.data["2023_RMSE"],
          },
          {
            name: 'persistence',
            type: 'line',
            data: response.data["2023_per_RMSE"],
          },

        ]
      }
      // SICChartErroPrediction.value = response.data.description;
    })
    .catch(error => {
      console.error(error);
    });
}

const updateTab2 = () => {
  axios.get('/seaice/errorBox?year=' + Number(selectedYear.value) + '&month=' + Number(selectedMonth.value))
    .then(response => {
      console.log(response.data);
      const data0 = response.data["withoutDA_withoutBC"];
      const data1 = response.data["withoutDA_withBC_RMSE"];
      const data2 = response.data["withDA_withoutBC_RMSE"];
      const data3 = response.data["MITgcm(with DA)withBC_RMSE"];
      option3.value = {
        title: {
          text: chartTitle3.value,
          left: 'center' //标题水平居中
        },

        dataset: [
          {
            source: data0
          },
          {
            source: data1
          },
          {
            source: data2
          },
          {
            source: data3
          },
          {
            fromDatasetIndex: 0,
            transform: { type: 'boxplot' }
          },
          {
            fromDatasetIndex: 1,
            transform: { type: 'boxplot' }
          },
          {
            fromDatasetIndex: 2,
            transform: { type: 'boxplot' }
          },
          {
            fromDatasetIndex: 3,
            transform: { type: 'boxplot' }
          }
        ],
        legend: {
          top: '10%'
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '10%',
          top: '20%',
          right: '10%',
          bottom: '15%'
        },
        xAxis: {
          type: 'category',
          name: 'Lead time',
          axisLabel: {
            formatter: function (value) {
              return (parseInt(value) + 1) + 'day';
            },
            align: 'center'
          },
          boundaryGap: true,
          nameGap: 30,
          splitArea: {
            show: true
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: 'RMSE(%)',
          splitArea: {
            show: false
          }
        },
        series: [
          {
            name: 'withDA_withoutBC_RMSE',
            type: 'boxplot',
            datasetIndex: 4
          },
          {
            name: 'withoutDA_withoutBC',
            type: 'boxplot',
            datasetIndex: 5
          },
          {
            name: 'withoutDA_withBC_RMSE',
            type: 'boxplot',
            datasetIndex: 6
          },
          {
            name: 'MITgcm(with DA)withBC_RMSE',
            type: 'boxplot',
            datasetIndex: 7
          }
        ]

      }

      //SICChartErroAdd.value = response.data.description;
    })
    .catch(error => {
      console.error(error);
    });
}


const updateTab3 = () => {
  axios.get('/seaice/predictionExamination/errorAnalysis?year=' + Number(selectedYear.value))
    .then(response => {
      console.log(response.data);
      option4.value = {
        title: {
          text: chartTitle4.value,
          left: 'center' //标题水平居中
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          // name: '时间',
          data: ['2020 spring', '2020 summer', '2020 fall', '2020 winter',
            '2021 spring', '2021 summer', '2021 fall', '2021 winter',
            '2022 spring', '2022 summer', '2022 fall', '2022 winter']
        },
        yAxis: {
          type: 'value',
          name: 'RMSD(million km²)',
          data: [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0]
        },
        legend: { //图例
          data: [''],
          orient: 'horizontal',
          left: 'center',
          bottom: '5',
        },
        series: [
          {
            type: 'line',
            data: response.data["RMSD"]
          }
        ]
      }
      option5.value = {
        title: {
          // text: chartTitle4.value,
          left: 'center' //标题水平居中
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          // name: '时间',
          data: ['2020 spring', '2020 summer', '2020 fall', '2020 winter',
            '2021 spring', '2021 summer', '2021 fall', '2021 winter',
            '2022 spring', '2022 summer', '2022 fall', '2022 winter']
        },
        yAxis: {
          type: 'value',
          name: 'RMSD²(million km²)',
          data: [0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8]
        },
        legend: { //图例
          data: ['bais', 'variance'],
          orient: 'horizontal',
          left: 'center',
          bottom: '5',
        },
        series: [
          {
            name: 'bais',
            type: 'bar',
            data: response.data["BAIS"]
          },
          {
            name: 'variance',
            type: 'bar',
            data: response.data["VAR"]
          },

        ]
      }
      option6.value = {
        title: {
          // text: chartTitle4.value,
          left: 'center' //标题水平居中
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          // name: '时间',
          data: ['2020 spring', '2020 summer', '2020 fall', '2020 winter',
            '2021 spring', '2021 summer', '2021 fall', '2021 winter',
            '2022 spring', '2022 summer', '2022 fall', '2022 winter']
        },
        yAxis: {
          type: 'value',
          name: 'Correlation coefficient',
          data: [0.970, 0.975, 0.980, 0.985, 0.990, 0.995, 1.000]
        },
        legend: { //图例
          data: [''],
          orient: 'horizontal',
          left: 'center',
          bottom: '5',
        },
        series: [
          {
            type: 'line',
            data: response.data["CORRELATION"]
          }
        ]
      }

      option7.value = {
        title: {
          // text: chartTitle4.value,
          left: 'center' //标题水平居中
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          // name: '时间',
          data: ['2020 spring', '2020 summer', '2020 fall', '2020 winter',
            '2021 spring', '2021 summer', '2021 fall', '2021 winter',
            '2022 spring', '2022 summer', '2022 fall', '2022 winter']
        },
        yAxis: {
          type: 'value',
          name: 'standard deviation(million km²)',
          data: [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5]
        },
        legend: { //图例
          data: ['observation', 'IceTFT'],
          orient: 'horizontal',
          left: 'center',
          bottom: '5',
        },
        series: [
          {
            name: 'observation',
            type: 'line',
            data: response.data["OBS_STD"]
          },
          {
            name: 'IceTFT',
            type: 'line',
            data: response.data["PRE_STD"]
          }
        ]
      }
    })
    .catch(error => {
      console.error(error);
    });
}

function selectChart(index) {
  chartSelected.value = index;
  switch (index) {
    case 0:
      start_year.value = start_year1.value;
      start_month.value = start_month1.value;
      selectedTime.value = new Date(start_year.value, start_month.value - 1);
      updateTab1();
      break;
    case 1:
      start_year.value = start_year2.value;
      start_month.value = start_month2.value;
      selectedTime.value = new Date(start_year.value, start_month.value - 1);
      updateTab2();
      break;
    case 2:
      start_year.value = start_year3.value;
      start_month.value = start_month3.value;
      selectedTime.value = new Date(start_year.value, start_month.value - 1);
      updateTab3();
      break;
  }
  end_year.value = start_year.value;
  end_month.value = start_month.value;

}

onMounted(() => {
  Promise.all([
    axios.get('/seaice/initial/SICError'),
    axios.get('/seaice/initial/SICErrorBox'),
    axios.get('/seaice/initial/SIEErrorAnalysis')
  ]).then(([res1, res2, res3]) => {
    // console.log(res1, res2, res3);
    start_year1.value = res1.data.yearList;
    start_month1.value = res1.data.monthList;

    start_year2.value = res2.data.yearList;
    start_month2.value = res2.data.monthList;

    start_year3.value = res3.data.yearList;
    start_month3.value = res3.data.monthList;

    selectChart(0);
  }).catch(error => {
    console.error('Error fetching data:', error);
  });
});


</script>

<template>
  <div class="pageContent">
    <div class="banner">
      <img :src="bannerImg" />
      <h3 class="title">海冰预测结果检验</h3>
    </div>

    <div class="menu-container">
      <ul class="menu">
        <div :style="movBoxStyle"></div>
        <li v-for="(chartName, index) in chartNames" :key="chartName" @click="selectChart(index)"
          :class="{ 'chart-name-selected': chartSelected === index }">
          <p>{{ chartName }}</p>
        </li>
      </ul>
    </div>


    <div style="margin: 0 10%;">

      <div class="datePickerContainer">
        <el-date-picker @change="updateChart()" v-model="selectedTime" type="month" :clearable="false"
          :disabledDate="limitedDateRange2" v-if="chartSelected === 0 || chartSelected === 2" />
        <el-date-picker @change="updateChart()" v-model="selectedTime" type="year" :clearable="false"
          :disabledDate="limitedDateRange" v-if="chartSelected === 1" />
      </div>

      <div class="text-container" v-if="chartSelected === 0">
        <div class="description">
          {{ SICChartErroPrediction }}
        </div>
      </div>
      <div class="text-container" v-if="chartSelected === 1">
        <div class="description">
          {{ SICChartErroAdd }}
        </div>
      </div>
      <div class="text-container" v-if="chartSelected === 2">
        <div class="description">
          {{ SIEChartErroAnalyse }}
        </div>
      </div>



      <div>
        <p></p>
      </div>

      <div v-if="chartSelected === 0">
        <div class="chart-selector">
          <v-chart :option="option1" autoresize></v-chart>

        </div>
        <div class="chart">
          <v-chart :option="option2" autoresize></v-chart>
        </div>

      </div>
      <div v-else-if="chartSelected === 1">
        <div class="chart">
          <v-chart :option="option3" autoresize></v-chart>
        </div>
      </div>
      <div v-else-if="chartSelected === 2">
        <div class="chart">
          <v-chart :option="option4" autoresize></v-chart>
        </div>
        <div class="chart">
          <v-chart :option="option5" autoresize></v-chart>
        </div>
        <div class="chart">
          <v-chart :option="option6" autoresize></v-chart>
        </div>
        <div class="chart">
          <v-chart :option="option7" autoresize></v-chart>
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
  letter-spacing: 1px;
  /* 字符间距 */
  z-index: 1;
  /* 确保图片在文字下方 */
  //color:#ffffff;
  color: rgb(19, 24, 36);
}

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

// .chart-selector {
//   position: relative;
//   //修改为块级
//   display: block;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   padding: 0px 15%;
// }

.chart-name-selected {
  color: rgb(30, 158, 179)
}



.chart {
  margin: 0 10%;
  height: 500px;
  background-color: white;
  /* 圆角 */
  border-radius: 8px;
  /* 阴影 */
  box-shadow: 0px 0px 10px 1.5px rgba(199, 198, 198, 0.893);
  padding-top: 20px;
  padding-bottom: 20px;
  // width: 82.5%;
  margin: auto;
}

.description {
  font-size: 23px;
}

.datePickerContainer {
  /* 其他样式 */
  display: flex;
  justify-content: flex-end;
  position: relative;
  padding: 50px 0 30px;
  // margin-right: 9%; //new
}

.text {
  margin-left: 5px;
  margin-right: 10px;
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
  // width: 80%;
}
</style>