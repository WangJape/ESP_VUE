<template>
  <div
    :id="id"
    style="width: 100%; min-height: 260px; height: 100%"
  ></div>
</template>
<script>
export default {
  name: "THLineChart",
  props: {
    id: String,
    rows: {
      type: Array,
      default: () => [],
      /*
      rows: [
        { 时间: "10:00:00", 温度: 13, 湿度: 19 },
        { 时间: "10:01:00", 温度: -17, 湿度: 33 },
        { 时间: "10:02:00", 温度: 29, 湿度: 22 },
        { 时间: "10:03:00", 温度: 35, 湿度: 12 },
        { 时间: "10:04:00", 温度: 37, 湿度: 39 },
        { 时间: "10:05:00", 温度: 45, 湿度: 49 },
      ],
       */
    },
  },
  data() {
    return {
      lineChart: null,
      lineChartOption: {
        tooltip: {},
        // legend: {
        //   data: ["温度", "湿度"],
        // },
        dataset: {
          dimensions: ["时间", "温度", "湿度"],
          source: [],
        },
        xAxis: {
          type: "category",
          axisLine: {
            onZero: false,
          },
        },
        yAxis: [
          {
            name: "温度(℃)",
            type: "value",
            nameTextStyle: {
              color: "#ffb348",
            },
            axisLabel: {
              color: "#ffb348",
            },
            splitLine: {
              show: false,
            },
          },
          {
            name: "湿度(%)",
            type: "value",
            min: 0,
            max: 100,
            nameTextStyle: {
              color: "#2d91ff",
            },
            axisLabel: {
              color: "#2d91ff",
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "温度",
            type: "line",
            yAxisIndex: 0,
            smooth: true,
            lineStyle: {
              color: "#ffb348",
            },
            itemStyle: {
              color: "#ffb348",
            },
            label: {
              show: true,
              position: "top",
              color: "#ffb348",
            },
          },
          {
            name: "湿度",
            type: "line",
            yAxisIndex: 1,
            smooth: true,
            lineStyle: {
              width: 0,
            },
            label: {
              show: true,
              position: "top",
              color: "#2d91ff",
            },
            areaStyle: {
              opacity: 0.8,
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(128, 255, 165)",
                },
                {
                  offset: 1,
                  color: "rgba(1, 191, 236)",
                },
              ]),
            },
          },
        ],
      },
    };
  },
  watch: {
    rows: {
      handler(newVal) {
        this.lineChartOption.dataset.source = newVal;
        this.lineChart.setOption(this.lineChartOption);
      },
      deep: true,
    },
  },
  mounted() {
    this.lineChart = this.$echarts.init(
      document.getElementById(this.id)
    );
    this.lineChartOption.dataset.source = this.rows;
    this.lineChart.setOption(this.lineChartOption);
  },
  methods: {},
};
</script>

<style scoped>
</style>