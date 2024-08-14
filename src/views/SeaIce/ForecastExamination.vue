<script setup>

import { ref, computed } from "vue";
import VChart from 'vue-echarts'
import axios from 'axios';
import bannerImg from '@/assets/ensoBanner.png';

const currentDate = new Date();
const year = currentDate.getFullYear() - 1 + '';
const month = currentDate.getMonth() < 10 ? '0' + (currentDate.getMonth() + 1 + '') : currentDate.getMonth() + 1 + ''

// selectedYear.value = '2023';
// selectedMonth.value = '01';

const selectedYear = ref('2023'); //改为了响应变量
const selectedMonth = ref('01'); //改为了响应变量

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
  backgroundColor: "blue",
  transition: "left 0.3s ease"
}));


function selectChart(index) {
  chartSelected.value = index;
  if (selectedSIE.value) {
    updateSIEChart();
  } else {
    updateSICChart();
  }
}

axios.get('/seaice/initial/SICError')
  .then(res => {
    start_year1.value = res.data.yearList;
    start_month1.value = res.data.monthList;
  });

axios.get('/seaice/initial/SICErrorBox')
  .then(res => {
    start_year2.value = res.data.yearList;
    start_month2.value = res.data.monthList;
  });

axios.get('/seaice/initial/SIEErrorAnalysis')
  .then(res => {
    start_year3.value = res.data.yearList;
    start_month3.value = res.data.monthList;
  });



function handleClick(tab, event) {
  console.log(tab.props.label);
  if (tab.props.label == 'SIC日预测误差') {
    start_year.value = start_year1.value;
    end_year.value = start_year1.value;
    start_month.value = start_month1.value;
    end_month.value = 1;
    selectedYear.value = '2023'
    selectedMonth.value = '01';

    chartTitle.value = `${selectedYear.value}年${selectedMonth.value}月 预测结果误差折线图`;
    chartX.value = [`${selectedYear.value}/${selectedMonth.value}/1`, `${selectedYear.value}/${selectedMonth.value}/2`, `${selectedYear.value}/${selectedMonth.value}/3`,
    `${selectedYear.value}/${selectedMonth.value}/4`, `${selectedYear.value}/${selectedMonth.value}/5`, `${selectedYear.value}/${selectedMonth.value}/6`,
    `${selectedYear.value}/${selectedMonth.value}/7`, `${selectedYear.value}/${selectedMonth.value}/8`, `${selectedYear.value}/${selectedMonth.value}/9`,
    `${selectedYear.value}/${selectedMonth.value}/10`, `${selectedYear.value}/${selectedMonth.value}/11`, `${selectedYear.value}/${selectedMonth.value}/12`,
    `${selectedYear.value}/${selectedMonth.value}/13`, `${selectedYear.value}/${selectedMonth.value}/14`, `${selectedYear.value}/${selectedMonth.value}/15`,
    `${selectedYear.value}/${selectedMonth.value}/16`, `${selectedYear.value}/${selectedMonth.value}/17`, `${selectedYear.value}/${selectedMonth.value}/18`,
    `${selectedYear.value}/${selectedMonth.value}/19`, `${selectedYear.value}/${selectedMonth.value}/20`, `${selectedYear.value}/${selectedMonth.value}/21`,
    `${selectedYear.value}/${selectedMonth.value}/22`, `${selectedYear.value}/${selectedMonth.value}/23`, `${selectedYear.value}/${selectedMonth.value}/24`,
    `${selectedYear.value}/${selectedMonth.value}/25`, `${selectedYear.value}/${selectedMonth.value}/26`, `${selectedYear.value}/${selectedMonth.value}/27`,]


    option1.value.title = {
      text: chartTitle.value,
      left: 'center' //标题水平居中
    }

    option1.value.xAxis = {
      data: chartX.value
    }

    option2.value.xAxis = {
      data: chartX.value
    }
  }
  else if (tab.props.label == 'SIC误差统计') {
    start_year.value = start_year2.value;
    end_year.value = start_year2.value;
    start_month.value = start_month2.value;
    end_month.value = 1;
    selectedYear.value = '2022'
    selectedMonth.value = '01';

    chartTitle3.value = `${selectedYear.value}年SIC回报结果误差箱型图`
    option3.value.title = {
      text: chartTitle3.value,
      left: 'center' //标题水平居中
    }

  }
  else if (tab.props.label == 'SIE误差分析') {
    // start_year.value = 2022;      //暂时写死范围
    // end_year.value = 2022;
    start_year.value = start_year3.value;
    end_year.value = start_year3.value;
    start_month.value = start_month3.value;
    end_month.value = 1;
    selectedYear.value = '2022'
    selectedMonth.value = '01';

    chartX1.value = [`${selectedYear.value - 2}spring`, `${selectedYear.value - 2}summer`, `${selectedYear.value - 2}fall`, `${selectedYear.value - 2}winter`,
    `${selectedYear.value - 1}spring`, `${selectedYear.value - 1}summer`, `${selectedYear.value - 1}fall`, `${selectedYear.value - 1}winter`,
    `${selectedYear.value}spring`, `${selectedYear.value}summer`, `${selectedYear.value}fall`, `${selectedYear.value}winter`
    ]

    option4.value.xAxis = {
      data: chartX1.value
    }

    option5.value.xAxis = {
      data: chartX1.value
    }

    option6.value.xAxis = {
      data: chartX1.value
    }


    option7.value.xAxis = {
      data: chartX1.value
    }
  }
}


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


function updateChart() {
  //使元素失焦
  document.activeElement.blur();

  updateTitles();
  updateXAxisData();
  updateChartOptions();
}

function updateTitles() {
  chartTitle.value = `${selectedYear.value}年${selectedMonth.value}月 预测结果误差折线图`;
  chartTitle3.value = `${selectedYear.value}年SIC回报结果误差箱型图`;
  chartTitle4.value = `SIE预测误差分析`;
}

function updateXAxisData() {
  chartX.value = generateDates(selectedYear.value, selectedMonth.value);
  chartX1.value = generateSeasonLabels(selectedYear.value);
}

function generateDates(year, month) {
  return Array.from({ length: 27 }, (_, i) => `${year}/${month}/${i + 1}`);
}

function generateSeasonLabels(year) {
  const seasons = ['spring', 'summer', 'fall', 'winter'];
  return Array.from({ length: 3 }, (_, i) => seasons.map(season => `${year - 2 + i} ${season}`)).flat();
}

function updateChartOptions() {
  option1.value = createChartOption(chartTitle.value, chartX.value, 'BACC(%)', data1);
  option2.value = createChartOption(chartTitle.value, chartX.value, 'RMSE(%)', data2);
  option3.value = createBoxPlotOption(chartTitle3.value, dataBoxPlot);
  option4.value = createChartOption(chartTitle4.value, chartX1.value, 'RMSD(million km²)', dataRMSD);
  option5.value = createChartOption(null, chartX1.value, 'RMSD²(million km²)', dataBAIS_VAR);
  option6.value = createChartOption(null, chartX1.value, 'Correlation coefficient', dataCorrelation);
  option7.value = createChartOption(null, chartX1.value, 'standard deviation(million km²)', dataStandardDeviation);
}

function createChartOption(title, xAxisData, yAxisName, seriesData) {
  return {
    title: { text: title, left: 'center' },
    tooltip: {},
    xAxis: { type: 'category', data: xAxisData },
    yAxis: { type: 'value', name: yAxisName },
    legend: { orient: 'horizontal', left: 'center', bottom: '5' },
    series: seriesData
  };
}

function createBoxPlotOption(title, data) {
  return {
    title: { text: title, left: 'center' },
    dataset: data.datasets,
    legend: { top: '10%' },
    tooltip: { trigger: 'item', axisPointer: { type: 'shadow' } },
    grid: { left: '10%', top: '20%', right: '10%', bottom: '15%' },
    xAxis: data.xAxis,
    yAxis: data.yAxis,
    series: data.series
  };
}


axios.get('/seaice/error?year=2023&month=1')
  // axios.get('/seaice/error?year='+Number(selectedYear.value)+'&month='+Number(selectedMonth.value))
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

    //SICChartErroPrediction.value = response.data.description;
  })
  .catch(error => {
    console.error(error);
  });




//axios.get('/seaice/error?year=2023&month=1')
axios.get('/seaice/error?year=' + Number(selectedYear.value) + '&month=' + Number(selectedMonth.value))
  .then(response => {
    console.log(response.data);
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




//axios.get('/seaice/errorBox?year='+Number(selectedYear.value)+'&month='+Number(selectedMonth.value))
axios.get('/seaice/errorBox?year=2022')
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




axios.get('/seaice/predictionExamination/errorAnalysis?year=2022')
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

    //SIEChartErroAnalyse.value = response.data.description;
  })
  .catch(error => {
    console.error(error);
  });






axios.get('/seaice/predictionExamination/errorAnalysis?year=2022')
  .then(response => {
    console.log(response.data);
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

    //SIEChartErroAnalyse.value = response.data.description;
  })
  .catch(error => {
    console.error(error);
  });





axios.get('/seaice/predictionExamination/errorAnalysis?year=2022')
  .then(response => {
    console.log(response.data);
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

    //SIEChartErroAnalyse.value = response.data.description;
  })
  .catch(error => {
    console.error(error);
  });




axios.get('/seaice/predictionExamination/errorAnalysis?year=2022')
  .then(response => {
    console.log(response.data);
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

    //SIEChartErroAnalyse.value = response.data.description;
  })
  .catch(error => {
    console.error(error);
  });


</script>

<template>
  <div class="pageContent">
    <div class="banner">
      <img :src="bannerImg"/>
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


    <div>
      <p></p>
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

    <div><p></p></div>
    
    <div class="datePickerContainer">
      <el-date-picker @change="updateChart()" v-model="currentDate" type="month" :clearable="false"
        :disabledDate="limitedDateRange2" v-if="chartSelected === 0 || chartSelected === 2" />
      <el-date-picker @change="updateChart()" v-model="currentDate" type="year" :clearable="false"
        :disabledDate="limitedDateRange" v-if="chartSelected === 1" />
    </div>

    <div v-if="chartSelected === 0">
      <div class="chart">
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
</template>


<style scoped lang="scss">
.title {
  text-align: center;
  font-size: 50px;
  margin-left: 20%;
  z-index: 1;
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
  cursor: pointer;
  /* 更改鼠标形状为手形 */
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

ul.menu li:hover p {
  color: red;
  /* 悬停时文字颜色变化为红色 */
  //color: lightgray; //浅灰不太好看
}

.chart-name-selected {
  color: blue;
}


.chart {
  margin-top: 50px;
  height: 500px;
  background-color:white;
}

.description {
  font-size: 23px;
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


.text-container {
  width: 90%;
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
  background-color:rgba(239, 242, 252, 0.801);; 
  /* 淡紫色 */
  display: flex;
  padding: 20px;
  border-radius: 8px;
  /* 可选的圆角 */
  box-shadow: 0px 0px 10px 1.5px rgba(199, 198, 198, 0.893); /* 阴影 */
  font-family: 'STKaiti';
  // font-size: 18px;
}

</style>

