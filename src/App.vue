<template>
  <div id="app">
    <el-container>
      <el-header>
        <home-header></home-header>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>
        <home-footer></home-footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import HomeHeader from './components/Header.vue'
import HomeFooter from './components/Footer.vue'

export default {
  name: 'app',
  components: {
    HomeHeader,
    HomeFooter
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
