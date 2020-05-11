<template>
  <div class="table">
    <p class="title" v-cloak>{{title}}</p>
    <div class="container">
      <div class="table-title border-bottom" ref="head">
        <div class="flex" ref="tbhead">
          <span>地区</span>
          <span>累计确诊</span>
          <span>死亡</span>
          <span>治愈</span>
          <span></span>
        </div>
      </div>
      <div class="table-body">
        <div class="item border-bottom" id="0" v-for="(item, index) in provice" :key="index">
          <div class="flex">
            <span v-cloak>{{item.cityName}}</span>
            <span v-cloak>{{item.confirmedCount}}</span>
            <span v-cloak>{{item.deadCount}}</span>
            <span v-cloak>{{item.curedCount}}</span>
            <span v-cloak><van-icon v-if="item.cities !== undefined" name="arrow-down" @touchstart="clkEvent($event)"/></span>
          </div>
          <div class="other show-not">
            <div class="flex" v-for="(city, index) in item.cities" :key="index">
              <span v-cloak>{{city.cityName}}</span>
              <span v-cloak>{{city.confirmedCount}}</span>
              <span v-cloak>{{city.deadCount}}</span>
              <span v-cloak>{{city.curedCount}}</span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'mytable',
  props: {
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    flag: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      provice: []
    }
  },
  mounted () {
    /*
    this.$nextTick(() => {
      var tableHead = this.$refs.tbhead
    })
    */
    this.listenScroll()
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scrollHander, true)
  },
  methods: {
    clkEvent (event) {
      var el = event.currentTarget
      var other = el.parentNode.parentNode.nextSibling
      if (el.classList.contains('van-icon-arrow-down') === true) {
        // 图标换为向上的 其余的数据显示
        el.classList.remove('van-icon-arrow-down')
        el.classList.add('van-icon-arrow-up')
        other.classList.remove('show-not')
      } else {
        // 图标换为向下的 其余的数据隐藏
        el.classList.remove('van-icon-arrow-up')
        el.classList.add('van-icon-arrow-down')
        other.classList.add('show-not')
      }
    },
    // 获取各省份数据
    getProvice () {
      this.provice = this.$store.getters.getProvice
    },
    // 获取世界各国的疫情数据
    getInternational () {
      this.provice = this.$store.getters.getInternational
      // console.log(this.provice[0].cities)
    },
    // 滚动监听
    scrollHander () {
      var targetRect = this.$refs.head.getBoundingClientRect()
      var targetTop = targetRect.top
      if (targetTop <= 0) {
        this.$refs.tbhead.classList.add('fixed')
      } else {
        this.$refs.tbhead.classList.remove('fixed')
      }
    },
    // 滚动条滚动高度获取
    getScrollTop () {
      var scrollTop = 0
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop
      } else if (document.body) {
        scrollTop = document.body.scrollTop
      }
      return scrollTop
    },
    // 滚动监听
    listenScroll () {
      // var windowHeight = document.documentElement.clientHeight
      // var lock = false
      window.addEventListener('scroll', this.scrollHander, true)
    }
  },
  watch: {
    // 监听获取数据完成标志位
    flag (newval, oldval) {
      if (newval === true && this.type === 'Nationwide') {
        // 从vuex中获取数据渲染
        this.getProvice()
      } else if (newval === true && this.type === 'international') {
        this.getInternational()
      }
    }
  }
}
</script>
<style lang="less" scoped>
[v-cloaak] {
  display: none;
}
.table{
  font-size: .12rem;
  width: 100%;
  .title{
    margin: 0;
    padding: 0;
    font-size: .18rem;
    font-weight: 700;
    text-align: left;
    color: #323332;
  }
  .container{
    width: 100%;
    .show-not{
      display: none;
    }
    .flex{
      width: 100%;
      height: .3rem;
      line-height: .3rem;
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;
      flex-direction: row;
      span{
        width: 22.5%;
        &:last-of-type{
          width: 10%;
        }
        &:first-of-type{
          text-align: left;
        }
      }
    }
    .border-bottom{
      border-bottom: 1px solid #eee;
    }
  }
  .table-title{
    height: .3rem;
  }
  .fixed{
    position: fixed;
    padding: 0 .1rem;
    box-sizing: border-box;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    top: 0;
    left: 0;
    z-index: 99;
  }
}
</style>
