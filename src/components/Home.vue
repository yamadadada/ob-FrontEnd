<template>
  <el-row :gutter="20">
    <el-col :span="11" :offset="2">
      <div id="main" style="width: 650px;height:450px;"></div>
    </el-col>
    <el-col :span="6" :offset="1">
      <span class="info">
        <div class="title">
          <el-tag>实时在线人数</el-tag>
        </div>
        <div class="content">{{now.toLocaleString('en-US')}}</div>
      </span>
      <el-divider></el-divider>
      <span class="info">
        <div class="title">
          <el-tag>24小时最高在线人数</el-tag>
        </div>
        <div class="content">{{dayMax.toLocaleString('en-US')}}</div>
      </span>
      <el-divider></el-divider>
      <span class="info">
        <div class="title">
          <el-tag>本月最高在线人数</el-tag>
        </div>
        <div class="content">{{monthMax.toLocaleString('en-US')}}</div>
      </span>
      <el-divider></el-divider>
      <span class="info">
        <div class="title">
          <el-tag>同比昨日</el-tag>
        </div>
        <div class="content" :class="dayRateColor">{{(dayRate * 100).toFixed(2) + '%'}}</div>
      </span>
      <el-divider></el-divider>
      <span class="info">
        <div class="title">
          <el-tag>同比上周</el-tag>
        </div>
        <div class="content" :class="weekRateColor">{{(weekRate * 100).toFixed(2) + '%'}}</div>
      </span>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      now: '',
      dayMax: '',
      monthMax: '',
      dayRate: '',
      weekRate: ''
    }
  },
  computed: {
    dayRateColor: function () {
      return {
        rate_red: this.dayRate > 0,
        rate_green: this.dayRate < 0
      }
    },
    weekRateColor: function () {
      return {
        rate_red: this.weekRate > 0,
        rate_green: this.weekRate < 0
      }
    }
  },
  mounted () {
    var that = this;
    var myChart = this.$echarts.init(document.getElementById('main'));
    this.$axios.get('httP://111.230.220.64:8081/overview').then(function(res) {
      res = res.data;
      if (res.code === 200 && res.data) {
        const data = res.data;
        that.now = data.now;
        that.dayMax = data.dayMax;
        that.monthMax = data.monthMax;
        that.dayRate = data.dayRate;
        that.weekRate = data.weekRate;
        myChart.setOption({
          xAxis: {
            data: data.xList
          },
          series: [{
              name: '观看人数',
              type: 'line',
              smooth: true,
              stack: '人数',
              data: data.yList,
              itemStyle: {
                color: '#1E88E5'
              }
            }
          ]
        })
      }
    })
    myChart.setOption({
      title: {
        text: '在线观看总人数'
      },
      tooltip: {
          trigger: 'axis'
      },
      grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
      },
      toolbox: {},
      xAxis: {
          type: 'category',
          boundaryGap: false,
          data: that.xList,
          axisLine: {
            show: false
          },
          axisLabel: {
            interval: 1,
            formatter: function(params) {
              var array = params.split(" ")
              return array[0] + '\n' + array[1]
            }
          }
      },
      yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          }
      }
    });
  }
}

</script>

<style scoped>
.title {
  text-align: left;
}
.content {
  font-size: 23px;
  font-weight: bold;
  color: #808080;
}
.rate_red {
  color: red
}
.rate_green {
  color: green
}
</style>