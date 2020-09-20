<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="8">
        <el-card shadow="hover" @click="tempTip">
          av-BV转换工具
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Tools',
  data () {
    return {

    }
  },
  mounted() {

  },
  methods: {
    tempTip: function() {
      this.$message('敬请期待');
    }
  }
}
</script>

<style>

</style>