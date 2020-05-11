<template>
  <div class="foreign">
    <!-- 总览数据 -->
    <div class="overview-container">
      <data-overview :data=overview>
        <span slot="time">{{time}}</span>
        <span slot="source">天行数据</span>
      </data-overview>
    </div>
    <!-- 地图 -->
    <div class="map-container">
      <map-echarts :data=dataMap :mapType="'world'"></map-echarts>
    </div>
    <!-- 数据表 -->
    <div class="table-container">
      <my-table :title="'各国情况'" :type="'international'" :flag=getDataFinshFlag></my-table>
    </div>
  </div>
</template>
<script>
import dataOverview from '@/conponents/dataOverview'
import mapEcharts from '@/conponents/mapEcharts'
import mytable from '@/conponents/table'
import { domesticTotalGet, foreignDataGet } from '@/api/requestApi.js'
export default {
  name: 'foreign',
  components: {
    dataOverview: dataOverview,
    mapEcharts: mapEcharts,
    myTable: mytable
  },
  data () {
    return {
      time: '',
      overview: [{
        count: 0,
        name: '现有确诊',
        compare: 0
      }, {
        count: 0,
        name: '累计确诊',
        compare: 0
      }, {
        count: 0,
        name: '累计治愈',
        compare: 0
      }, {
        count: 0,
        name: '累计死亡',
        compare: 0
      }],
      dataMap: [],
      tableData: [],
      getDataFinshFlag: false
    }
  },
  created () {
    this.overviewDataRequest()
    this.mapDataRequest()
  },
  methods: {
    // 获取总览数据
    overviewDataRequest () {
      domesticTotalGet().then(res => {
        if (res.code === 200 && res.msg === 'success') {
          const resData = res.newslist[0].desc.foreignStatistics
          this.time = new Date(res.newslist[0].desc.modifyTime).toLocaleString()
          this.overview[0].count = resData.currentConfirmedCount
          this.overview[0].compare = resData.currentConfirmedIncr > 0 ? '+' + resData.currentConfirmedIncr : resData.currentConfirmedIncr
          this.overview[1].count = resData.confirmedCount
          this.overview[1].compare = resData.confirmedIncr > 0 ? '+' + resData.confirmedIncr : resData.confirmedIncr
          this.overview[2].count = resData.curedCount
          this.overview[2].compare = resData.curedIncr > 0 ? '+' + resData.curedIncr : resData.curedIncr
          this.overview[3].count = resData.deadCount
          this.overview[3].compare = resData.deadIncr > 0 ? '+' + resData.deadIncr : resData.deadIncr
        } else {
          console.log(res.msg)
        }
      })
    },
    // 地图数据获取
    mapDataRequest () {
      foreignDataGet().then(res => {
        if (res.code === 200 && res.msg === 'success') {
          const resData = res.newslist
          resData.forEach((Element, index, resData) => {
            // eslint-disable-next-line prefer-const
            let obj = {}
            obj.name = Element.provinceName
            obj.value = Element.confirmedCount
            this.dataMap.push(obj)
            // eslint-disable-next-line prefer-const
            let tobj = {}
            tobj.cityName = Element.provinceName
            tobj.confirmedCount = Element.confirmedCount
            tobj.deadCount = Element.deadCount
            tobj.curedCount = Element.curedCount
            this.tableData.push(tobj)
          })
          this.getDataFinshFlag = true
          this.$store.commit('addInternational', this.tableData)
        } else {
          console.log(res.msg)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.foreign{
  width: 100%;
  padding: .1rem;
  box-sizing: border-box;
  // map-container
  .map-container{
    width: 100%;
    height: 3.2rem;
    margin-top: .1rem;
  }
}
</style>
