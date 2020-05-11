<template>
  <div class="overview">
    <div class="o-time">
      <span>统计截止：</span>
      <slot class="time" name="time"></slot>
    </div>
    <div class="o-source">
      <span>数据来源：</span>
      <slot class="source" name="source"></slot>
    </div>
    <div class="o-item">
      <div class="item" v-for="(item, index) in data" :key="index">
        <h4 class="count">{{item.count}}</h4>
        <h4 class="desc">{{item.name}}</h4>
        <span class="compare">较昨日{{item.compare}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dataOverview',
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      }
    }
  }
}
</script>
<style lang="less" scoped>
p, h4, h5{
  margin: 0;
  padding: 0;
}
.overview{
  width: 100%;
  height: 100%;
  font-size: .14rem;
  .o-time, .o-source{
    text-align: left;
    >span:first-of-type{
      font-size: .12rem;
      color: #999;
    }
    >span:last-of-type{
      color: #333;
      font-size: .12rem;
    }
  }
  .o-item{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    margin-top: .1rem;
    .item{
      flex: 1;
      padding-bottom: .1rem;
      border-bottom: .03rem solid red;
      color: red;
      background: linear-gradient(to bottom, #FBF9F8, #FCE4E2);
      .count{
        font-size: .20rem;
      }
      .desc{
        font-size: .16rem;
        color: #000;
      }
      .compare{
        font-size: .12rem;
        color: #777;
      }
      &:nth-of-type(2){
        background: linear-gradient(to bottom, #FEFBF6, #FCF3E1);
        border-color: #E79B54;
        color: #E79B54;
      }
      &:nth-of-type(3){
        background: linear-gradient(to bottom, #F9FBF8, #EAF7E6);
        border-color: #5A9A46;
        color: #5A9A46;
      }
      &:nth-of-type(4){
        background: linear-gradient(to bottom, #FAFBFA, #E8E9EA);
        border-color: #000000;
        color: #000;
      }
    }
  }
}
</style>
