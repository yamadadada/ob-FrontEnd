<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" >
    <el-menu-item index="1">
      <router-link to='/'>
        首页
      </router-link>
    </el-menu-item>
    <el-menu-item index="2">
      <router-link to='/game'>
        游戏榜
      </router-link>
    </el-menu-item>
    <el-menu-item index="3">
      <router-link to='/bili'>
        哔哩哔哩
      </router-link>
    </el-menu-item>
    <el-menu-item index="4">
      <router-link to='/fund'>
        基金
      </router-link>
    </el-menu-item>
    <el-menu-item index="5">
      <router-link to='/tools'>
        小工具
      </router-link>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      activeIndex: '1'
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
