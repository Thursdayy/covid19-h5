<template>
  <div id="app">
    <!-- 顶部图片 -->
    <div class="img-container">
      <img src="../src/assets/1234.png" alt="疫情追踪">
    </div>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <van-tabbar route>
      <van-tabbar-item replace to="/domestic" icon="home-o">
        国内疫情
      </van-tabbar-item>
      <van-tabbar-item replace to="/foreign" icon="home-o">
        国外疫情
      </van-tabbar-item>
      <van-tabbar-item replace to="/local" icon="home-o">
        本地疫情
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  box-sizing: border-box;
  margin-bottom: .5rem;
  overflow: hidden;
  // top image container
  .img-container{
    // width: 100%;
    height: 1rem;
    background-color: pink;
    box-sizing: border-box;
    margin: .1rem;
    img{
      width: 100%;
      box-sizing: border-box;
    }
  }
}
</style>
