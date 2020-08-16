<template>
  <div style="width: 40%; margin: auto;">
    <el-timeline style="text-align: left;">
      <el-timeline-item v-for="log in logList" :key="log.id" :timestamp="log.time" placement="top">
        <el-card>
          <h4>Version: {{log.version}}</h4>
          <div v-html="log.comment"></div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  name: 'Log',
  data() {
    return {
      logList: []
    }
  },
  mounted() {
    const that = this;
    this.$axios.get(this.COMMON.host + '/bili/log').then(function(res) {
        res = res.data;
        if (res.code === 200 && res.data) {
            const data = res.data;
            that.logList = data;
        }
    })
  }
}
</script>

<style>

</style>