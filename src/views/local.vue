<template>
  <div class="local">
    <!-- 位置信息 -->
    <div class="location">
      <div class="left" @click="locationTouch">
        <span><van-icon name="location" color="red"/></span>
        <span v-text="location"></span>
        <span><van-icon name="arrow-down" /></span>
      </div>
      <div class="right">
        <span>更新时间：{{time}}</span>
      </div>
    </div>
    <!-- 当前城市疫情数据显示 -->
    <div class="city-container" v-show="cityArr.length !== 0">
      <div class="item">
        <div class="data"><span>{{cityArr.confirmedCount}}</span></div>
        <div class="desc"><span>累计确诊</span></div>
      </div>
      <div class="item">
        <div class="data">{{cityArr.suspectedCount}}</div>
        <div class="desc">现有疑似</div>
      </div>
      <div class="item">
        <div class="data">{{cityArr.curedCount}}</div>
        <div class="desc">累计治愈</div>
      </div>
      <div class="item">
        <div class="data">{{cityArr.deadCount}}</div>
        <div class="desc">累计死亡</div>
      </div>
    </div>
    <!-- 附近疫情 -->
    <div class="nearby-container">
      <div class="item" v-for="(item, index) in nearby" :key="index">
        <div class="nearby-location">
          <span>确诊地点:</span>
          <span>{{item.locale}}</span>
        </div>
        <div class="nearby-addr">
          <span>详细地址:</span>
          <span>{{item.address}}</span>
        </div>
        <div class="nearby-distance">
          <span>与我相距:</span>
          <span>{{item.distance}}</span>
        </div>
      </div>
    </div>
    <!-- 城市选择弹出框 -->
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
        title="请选择"
      />
    </van-popup>
  </div>
</template>
<script>
import { cityDataGet, nearbyGet } from '@/api/requestApi.js'
export default {
  name: 'local',
  data () {
    return {
      columns: [
        {
          text: '广东省',
          children: [
            {
              text: '广州市',
              children: [{ text: '天河区' }, { text: '越秀区' }, { text: '白云区' }, { text: '荔湾区' }, { text: '黄埔区' }, { text: '海珠区' }, { text: '番禺区' }, { text: '增城区' }]
            },
            {
              text: '深圳市',
              children: [{ text: '宝安区' }, { text: '罗湖区' }, { text: '南山区' }, { text: '龙华区' }, { text: '福田区' }, { text: '龙岗区' }]
            }
          ]
        },
        {
          text: '四川省',
          children: [
            {
              text: '成都市',
              children: [{ text: '锦江区' }, { text: '青羊区' }, { text: '金牛区' }, { text: '武侯区' }, { text: '成华区' }, { text: '龙泉驿区' }, { text: '青白江区' }, { text: '新都区' }, { text: '双流区' }, { text: '温江区' }]
            }
          ]
        }
      ],
      showPicker: false,
      provice: '',
      city: '',
      district: '',
      cityArr: [],
      time: '',
      nearby: [],
      mypoint: ''
    }
  },
  created () {
    this.getLocation()
  },
  methods: {
    locationTouch () {
      this.showPicker = true
    },
    onConfirm (value) {
      this.value = value
      this.showPicker = false
      this.provice = this.value[0]
      this.city = this.value[1]
      this.district = this.value[2]
    },
    // 定位
    getLocation () {
      /* eslint-disable */
      var geolocation = new BMap.Geolocation()
      var that = this
      var lat = ''
      var lng = ''
      geolocation.getCurrentPosition(function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          that.provice = r.address.province
          that.city = r.address.city
          that.district = r.address.district
          lng = r.longitude
          lat = r.latitude
        } else {
          console.log("failed" + this.getStatus());
          that.provice = '广东省'
          that.city = '广州市'
          that.district = '天河区'
          lat = 23.135416427635
          lng = 113.44066263961
        }
        that.mypoint = new BMap.Point(lng, lat)
      })
      /* eslint-enable */
    },
    // 从服务器获取城市数据
    getCityData () {
      cityDataGet().then(res => {
        if (res.code === 200 && res.msg === 'success') {
          const resData = res.newslist
          resData.forEach((element, index, arr) => {
            if (element.provinceName === this.provice) {
              element.cities.forEach((item, index, cityArr) => {
                if (item.cityName === this.city.slice(0, 2)) {
                  this.cityArr = item
                }
              })
            }
          })
          this.time = new Date()
          this.time = this.time.toLocaleString()
          this.time = this.time.slice(0, 10)
        } else {
          console.log(res.msg)
        }
      })
    },
    // 获取附近疫情
    getNearbyData () {
      nearbyGet(this.provice, this.city, this.district).then(res => {
        if (res.code === 200 && res.msg === 'success') {
          const resData = res.newslist
          // eslint-disable-next-line no-undef
          var map = new BMap.Map('map')
          resData.forEach((element, index, arr) => {
            /* eslint-disable */
            let obj = {}
            obj.locale = element.locale
            obj.address = element.address
            let point = new BMap.Point(element.lng, element.lat)
            obj.distance = (map.getDistance(this.mypoint, point) / 1000).toFixed(2) + 'km'
            this.nearby.push(obj)
            /* eslint-enable */
          })
        } else {
          console.log(res.msg)
        }
      })
    }
  },
  watch: {
    location: function (newval, oldval) {
      if (newval !== '') {
        this.getCityData()
      }
    },
    district: function (newval, oldval) {
      if (newval !== '') {
        this.nearby.length = 0
        this.getNearbyData()
      }
    }
  },
  computed: {
    location: function () {
      return (this.provice + this.city + this.district)
    }
  }
}
</script>
<style lang="less" scoped>
.local{
  box-sizing: border-box;
  font-size: .14rem;
  background-color: #fff;
  // location
  .location{
    line-height: .3rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    background-color: #fff;
    padding: .1rem;
    box-sizing: border-box;
    .left{
      font-size: .16rem;
      flex: 1;
      text-align: left;
    }
    .right{
      font-size: .12rem;
      flex: 1;
      text-align: right;
      span{
        color: #999;
      }
    }
  }
  .city-container{
    width: 100%;
    padding: .15rem 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    background-color: #fff;
    padding: .1rem;
    box-sizing: border-box;
    .item{
      flex: 1;
      &:last-of-type{
        .data{
          border: 0;
        }
      }
    }
    .data{
      font-size: .2rem;
      font-weight: 700;
      color: #1EA3FE;
      border-right: 1px solid #eee;
    }
  }
  // nearby-container
  .nearby-container{
    width: 100%;
    padding: .1rem;
    box-sizing: border-box;
    .item{
      box-sizing: border-box;
      margin-bottom: .2rem;
      border-bottom: 1px solid #eee;
      .nearby-location, .nearby-addr, .nearby-distance{
        height: .3rem;
        line-height: .3rem;
        text-align: left;
        span:first-of-type{
          margin-right: .1rem;
        }
      }
    }
  }
}
</style>
