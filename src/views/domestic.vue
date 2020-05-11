/* eslint-disable prefer-const */
<template>
  <div class="domestic">
    <!-- 数量总览 -->
    <div class="view-container">
      <data-overview :data=dataview>
        <span slot="time" v-cloak>{{time}}</span>
        <span slot="source">天行数据</span>
      </data-overview>
    </div>
    <!-- 疫情地图 -->
    <div class="map-container">
      <map-echarts :data=dataMap :mapType="'china'"></map-echarts>
    </div>
    <!-- 确诊疑似趋势图 -->
    <!-- :data1=data1 :data2=data2 -->
    <div class="trend">
      <confirme-trend :title="'全国疫情病例趋势图(例)'" :legend=ylegend1 :xdata=xdata :ymax=100000 :data1=confirmeData :data2=suspectedData></confirme-trend>
    </div>
    <!-- 治愈死亡去死图 -->
    <div class="trend">
        <confirme-trend :title="'累计死亡和治愈趋势(例)'" :legend=ylegend2 :xdata=xdata :ymax=80000 :data1=cureData :data2=deadData></confirme-trend>
    </div>
    <!-- 全国情况 -->
    <div class="table-container">
      <my-table :title="'全国情况'" :type="'Nationwide'" :flag=getDataFinshFlag></my-table>
    </div>
  </div>
</template>
<script>
import dataOverview from '@/conponents/dataOverview'
import mapEcharts from '@/conponents/mapEcharts'
import confirmeTrend from '@/conponents/confirmedSupspectedTrend'
import mytable from '@/conponents/table'
import { domesticGet, domesticCountGet, domesticTotalGet } from '../api/requestApi'
export default {
  name: 'domestic',
  components: {
    dataOverview: dataOverview,
    mapEcharts: mapEcharts,
    confirmeTrend: confirmeTrend,
    myTable: mytable
  },
  data () {
    return {
      dataview: [{
        count: 0,
        name: '累计确诊',
        compare: '+9'
      }, {
        count: 0,
        name: '现有疑似',
        compare: '+2'
      }, {
        count: 0,
        name: '累计治愈',
        compare: '+89'
      }, {
        count: 0,
        name: '累计死亡',
        compare: 0
      }],
      dataMap: [],
      confirmeAndSupected: [],
      deadAndCured: [],
      time: '',
      // 全国疫情确诊疑似趋势
      ylegend1: [{
        name: '累计确诊',
        icon: 'circle',
        backgroundColor: '#379ED3'
      }, {
        name: '现有疑似',
        icon: 'circle',
        backgroundColor: '#F6D360'
      }],
      xdata: ['01.27', '02.03', '02.10', '02.17', '02.24', '03.02', '03.09', '03.16', '03.23', '03.30', '04.06', '04.13', '04.20', '04.27'],
      data1: [],
      data2: [],
      confirmeData: [2744, 17205, 40171, 70642, 77269, 80175, 80905, 81099, 81691, 82505, 83039, 83607, 84239, 84341],
      suspectedData: [5794, 21558, 23589, 7264, 3434, 715, 421, 123, 376, 723, 951, 1378, 1583, 1636],
      // 治愈死亡
      ylegend2: [{
        name: '累计治愈',
        icon: 'circle',
        backgroundColor: '#379ED3'
      }, {
        name: '累计死亡',
        icon: 'circle',
        backgroundColor: '#F6D360'
      }],
      cureData: [51, 475, 3281, 11278, 25007, 44846, 58824, 67930, 72848, 75956, 77367, 78148, 77948, 78596],
      deadData: [80, 361, 908, 1772, 2596, 2915, 3124, 3218, 3276, 3313, 3340, 3351, 4642, 4643],
      getDataFinshFlag: false
    }
  },
  created () {
    // 请求国内疫情数据
    this.requestDomestic()
    // this.requestTrend()
    this.requestTotal()
  },
  methods: {
    // 获取地图显示数据
    requestDomestic () {
      // 获取当前日期
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      var getDate = year + '-' + month + '-' + day
      // api发起数据请求
      domesticGet(getDate).then((res) => {
        if (res.code === 200 && res.msg === 'success') {
          for (let i = 0; i < res.newslist.length; i++) {
            // eslint-disable-next-line prefer-const
            let item = res.newslist[i]
            // eslint-disable-next-line prefer-const
            let totalCount = {}
            this.getProvice(item)
            // 获取地图显示数据
            if (item.provinceName.indexOf('省') !== -1 || item.provinceName.indexOf('市') !== -1) {
              item.provinceName = item.provinceName.slice(0, item.provinceName.length - 1)
            }
            if (item.provinceName === '内蒙古自治区') {
              item.provinceName = '内蒙古'
            }
            if (item.provinceName === '广西壮族自治区') {
              item.provinceName = '广西'
            }
            if (item.provinceName === '新疆维吾尔自治区') {
              item.provinceName = '新疆'
            }
            if (item.provinceName === '宁夏回族自治区') {
              item.provinceName = '宁夏'
            }
            if (item.provinceName === '西藏自治区') {
              item.provinceName = '西藏'
            }
            totalCount.name = item.provinceName
            totalCount.value = item.confirmedCount
            this.dataMap.push(totalCount)
          }
          this.getDataFinshFlag = true
        }
      })
    },
    // 获取趋势图数据
    requestTrend () {
      // 基础日期，从2020年2月3日起，请求隔一个星期的数据
      var date = this.getDate()
      date.forEach(element => {
        // 发起api请求，共十次
        domesticCountGet(element).then(res => {
          if (res.code === 200 && res.msg === 'success') {
            const resData = res.newslist[0].desc
            var obj1 = {}
            var obj2 = {}
            // 时间
            obj1.date = new Date(resData.modifyTime)
            var year = obj1.date.getFullYear()
            var month = obj1.date.getMonth() + 1
            month = String(month).length < 2 ? '0' + month : month
            var day = obj1.date.getDate()
            day = String(day).length < 2 ? '0' + day : day
            obj1.date = year + '-' + month + '-' + day
            // 累计确诊
            obj1.confirmedCount = resData.confirmedCount
            // 现存疑似
            obj1.suspectedCount = resData.suspectedCount
            obj2.date = obj1.date
            // 累计治愈
            obj2.curedCount = resData.curedCount
            // 累计死亡
            obj2.deadCount = resData.deadCount
            this.data1.push(obj1)
            this.data2.push(obj2)
          } else {
            console.log(res)
          }
        })
      })
    },
    // 获取总览数据
    requestTotal () {
      domesticTotalGet().then(res => {
        if (res.code === 200 && res.msg === 'success') {
          const resData = res.newslist[0].desc
          let time = new Date(resData.modifyTime)
          time = time.toLocaleString()
          console.log(time)
          this.time = time
          this.dataview[0].count = resData.confirmedCount
          this.dataview[0].compare = resData.confirmedIncr > 0 ? '+' + resData.confirmedIncr : resData.confirmedIncr
          this.dataview[1].count = resData.suspectedCount
          this.dataview[1].compare = resData.suspectedIncr > 0 ? '+' + resData.suspectedIncr : resData.suspectedIncr
          this.dataview[2].count = resData.curedCount
          this.dataview[2].compare = resData.curedIncr > 0 ? '+' + resData.curedIncr : resData.curedIncr
          this.dataview[3].count = resData.deadCount
          this.dataview[3].compare = resData.deadIncr > 0 ? '+' + resData.deadIncr : resData.deadIncr
        } else {
          console.log(res.msg)
        }
      })
    },
    // 获取当前日期，基于当前日期每往前7天取一个日期，返回一个日期数组
    getDate () {
      var date = []
      var date1 = ''
      for (let i = 0; i < 10; i++) {
        date1 = new Date()
        let curr = date1.setDate(date1.getDate() - (i * 7))
        curr = new Date(curr)
        const currYear = curr.getFullYear()
        let currDay = curr.getDate()
        currDay = String(currDay).length < 2 ? '0' + currDay : currDay
        let currMonth = curr.getMonth() + 1
        currMonth = String(currMonth).length < 2 ? '0' + currMonth : currMonth
        date.push(currYear + '-' + currMonth + '-' + currDay)
      }
      return date
    },
    // 获取个省份的数据
    getProvice (item) {
      // eslint-disable-next-line prefer-const
      let nationObj = {}
      nationObj.cityName = item.provinceShortName
      nationObj.confirmedCount = item.confirmedCount
      nationObj.deadCount = item.deadCount
      nationObj.curedCount = item.curedCount
      nationObj.cities = []
      for (let j = 0; j < item.cities.length; j++) {
        // eslint-disable-next-line prefer-const
        let city = item.cities
        // eslint-disable-next-line prefer-const
        let cityObj = {}
        cityObj.cityName = city[j].cityName
        cityObj.confirmedCount = city[j].confirmedCount
        cityObj.deadCount = city[j].deadCount
        cityObj.curedCount = city[j].curedCount
        nationObj.cities.push(cityObj)
      }
      this.$store.commit('addProvice', nationObj)
    }
  },
  watch: {
    data1 (newval, oldval) {
      if (newval.length === 10) {
        var arr = []
        newval.forEach((element, index, newval) => {
          arr.push(element)
        })
        arr.sort((a, b) => {
          return (new Date(b.date)) - (new Date(a.date))
        })
        arr.forEach((element, index, arr) => {
          // this.xdata.push(element.date)
          // this.confirmeData.push(element.confirmedCount)
          // this.suspectedData.push(element.suspectedCount)
        })
        // console.log(this.xdata)
        // console.log(this.confirmeData)
        // console.log(this.suspectedData)
      }
    },
    data2 (newval, oldval) {
      if (newval.length === 10) {
        var arr = []
        newval.forEach((element, index, newval) => {
          arr.push(element)
        })
        arr.sort((a, b) => {
          return (new Date(b.date)) - (new Date(a.date))
        })
        this.suspectedData = arr
      }
    }
  }
}
</script>
<style lang="less" scoped>
.domestic{
  box-sizing: border-box;
  padding: .1rem;
}

// total data overview
.view-container{
  margin-top: .1rem;
}
// map-container
.map-container{
  width: 100%;
  height: 3.2rem;
  margin-top: .1rem;
}
// trend
.trend{
  margin-top: .1rem;
  width: 100%;
  height: 3rem;
}
// table-container
.table-container{
  width: 100%;
}
</style>
