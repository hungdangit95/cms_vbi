<template>
  <div :class="className" :style="{height:height,width:width}" :dataLabel="dataLabel" :dataLine="dataLine" :dataBar="dataBar"/>
</template>

<script>
  import echarts from "echarts";
  const animationDuration = 6000

  export default {
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '300px'
      },
      dataLabel: {
        type: Array
      },
      dataLine: {
        type: Array
      },
      dataBar: {
        type: Array
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart()
      })
    },
    updated() {
      this.$nextTick(() => {
        this.initChart()
      })
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons');
        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            top: 10,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: this.dataLabel,
            axisTick: {
              alignWithLabel: true
            },
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
            name: 'Request',
            type: 'bar',
            label: {
              show: true,
              position: 'inside'
            },
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.1)'
            },
            itemStyle: {
              color: '#337ab7'
            },
            data: this.dataBar,
            animationDuration
          },
          {
            name: 'Exception',
            type: 'line',
            itemStyle: {
              color: '#fc8452'
            },
            smooth: true,
            data: this.dataLine,
          }
          ]
        })
      }
    }
  }
</script>
