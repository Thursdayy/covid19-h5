<template>
  <div class="trend" ref="box">
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'confiredSupspectedTrend',
  props: {
    title: {
      type: String,
      default: function () {
        return '趋势图'
      }
    },
    legend: {
      type: Array,
      default: function () {
        return []
      }
    },
    xdata: {
      type: Array,
      default: function () {
        return []
      }
    },
    ymax: {
      type: Number
    },
    data1: {
      tupe: Array,
      default: function () {
        return []
      }
    },
    data2: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {}
  },
  created () {
    this.option = {
      // 背景颜色
      backgroundColor: '#fff',
      title: {
        text: this.title
      },
      tooltip: {
        trigger: 'axis',
        show: true
      },
      legend: {
        right: 'auto',
        top: 25,
        textStyle: {
          fontSize: 10
        },
        data: this.legend
      },
      grid: {
        left: '12%'
      },
      // X轴设置
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          rotate: 40,
          fontSize: 8
        },
        data: this.xdata
      },
      // Y
      yAxis: {
        type: 'value',
        show: true,
        max: this.ymax,
        minInterval: 1,
        boundaryGap: [0, 0.1],
        nameLocation: 'end',
        // 刻度字体设置
        axisLabel: {
          fontSize: 8
        },
        // 轴线设置
        axisLine: {
          show: false
        },
        // 刻度设置
        axisTick: {
          show: false
        }
      },
      series: [{
        type: 'line',
        name: this.legend[0].name,
        smooth: false,
        lineStyle: {
          normal: {
            color: '#C23530',
            width: 2
          }
        },
        data: this.data1
      }, {
        type: 'line',
        name: this.legend[1].name,
        smooth: false,
        lineStyle: {
          normal: {
            color: '#2E4453',
            width: 2
          }
        },
        data: this.data2
      }
      ]
    }
  },
  mounted () {
    // 初始化趋势图
    this.$nextTick(() => {
      this.trend = echarts.init(this.$refs.box)
      this.trend.setOption(this.option)
    })
  },
  methods: {},
  watch: {
    data1: function (newval, oldval) {
      this.trend.setOption(this.option)
    },
    data2: function (newval, oldval) {
      this.trend.setOption(this.option)
    }
  }
}
</script>
<style lang="less">
.trend{
  width: 100%;
  height: 100%;
}
</style>
