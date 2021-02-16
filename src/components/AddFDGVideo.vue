<template>
  <div style="text-align: center">
    <el-form ref="form" label-width="150px" style="width: 500px; margin: 0 auto" >
      <el-form-item label="BV号">
        <el-input v-model="bv" style="margin-left: 10px"></el-input>
      </el-form-item>
      <el-form-item label="★⑥檤轮囬★">
        <el-switch v-model="liudao"></el-switch>
      </el-form-item>
      <el-form-item label="pipi-萍萍">
        <el-switch v-model="pipi"></el-switch>
      </el-form-item>
      <el-form-item label="一马平川的妥妥">
        <el-switch v-model="tuotuo"></el-switch>
      </el-form-item>
      <el-form-item label="漠☆漠">
        <el-switch v-model="momo"></el-switch>
      </el-form-item>
      <el-form-item label="果哝双子">
        <el-switch v-model="guonong"></el-switch>
      </el-form-item>
      <el-form-item label="韩小沐">
        <el-switch v-model="hanxiaomu"></el-switch>
      </el-form-item>
      <el-form-item label="醋醋cucu">
        <el-switch v-model="cucu"></el-switch>
      </el-form-item>
      <el-form-item label="伢伢gagako">
        <el-switch v-model="yaya"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即提交</el-button>
      </el-form-item>
    </el-form>
    <div>
      {{ video.title }}
    </div>
    <div>
      <el-image style="width: 200px; height: 150px" :src="video.pic" fit="fill">
        <div slot="error">
        </div>
      </el-image>
    </div>
    <div>
      {{ moment((new Date(video.pubdate)).getTime() + 3600 * 1000 * 8).format('YYYY-MM-DD HH:mm:ss') }}
    </div>
    <div>
      UP主：{{ video.owner }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddFDGVideo',
  data () {
    return {
      bv: null,
      liudao: false,
      pipi: false,
      tuotuo: false,
      momo: false,
      guonong: false,
      hanxiaomu: false,
      cucu: false,
      yaya: false,
      video: {
        title: '',
        pic: '',
        pubdate: '',
        owner: ''
      }
    }
  },

  mounted() {

  },

  methods: {
    onSubmit: function() {
      if (this.isEmpty(this.bv)) {
        this.$message('请输入BV号');
        return;
      }
      const that = this;
      let data = {
        "bv": this.bv,
        "liudao": this.liudao,
        "pipi": this.pipi,
        "tuotuo": this.tuotuo,
        "momo": this.momo,
        "guonong": this.guonong,
        "hanxiaomu": this.hanxiaomu,
        "cucu": this.cucu,
        "yaya": this.yaya
      }
      this.$axios.post(this.COMMON.host + '/fdg/addFDGVideo', data).then(function(res) {
        res = res.data;
        if (res.code === 200 && res.data) {
          const data = res.data;
          that.video = data;
          that.$message('提交成功！');
        } else {
          that.$message.error('没有找到相关视频');
        }
      }).catch(function () {
        that.$message.error('没有找到相关视频');
      });
    },
    
    isEmpty: function(obj) {
      if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
      }
      return false;
    }
  }
}
</script>

<style>

</style>