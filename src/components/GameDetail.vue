<template>  
  <el-tabs type="card">
    <el-tab-pane label="基本数据">
      <div id="allChart" style="width: 1450px; height: 450px;"></div>
    </el-tab-pane>
    <el-tab-pane label="每日平均">
      <div id="dayChart" style="width: 1450px; height: 450px;"></div>
    </el-tab-pane>
    <el-tab-pane label="斗鱼"></el-tab-pane>
    <el-tab-pane label="虎牙"></el-tab-pane>
    <el-tab-pane label="bilibili"></el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: 'GameDetail',
  data () {
    return {
      gid: this.$route.params.gid
    }
  },
  mounted () {
    var allChart = this.$echarts.init(document.getElementById('allChart'));
    var dayChart = this.$echarts.init(document.getElementById('dayChart'));
    allChart.setOption({
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%'];
        }
      },
      title: {
        left: 'center',
        text: '每小时在线人数',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
      },
      dataZoom: [{
        type: 'inside',
        start: 90,
        end: 100
      }, {
        start: 90,
        end: 100,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }],
      series: [
        {
          name: '在线人数',
          type: 'line',
          smooth: true,
          itemStyle: {
            color: '#1E88E5'
          },
          data: []
        }
      ]
    });
    dayChart.setOption({
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%'];
        }
      },
      title: {
        left: 'center',
        text: '每天在线人数',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
      },
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100
      }, {
        start: 0,
        end: 100,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }],
      series: [
        {
          name: '在线人数',
          type: 'line',
          smooth: true,
          itemStyle: {
            color: '#1E88E5'
          },
          data: []
        }
      ]
    });
    this.$axios.get('httP://111.230.220.64:8081/game/' + this.gid).then(function(res) {
      res = res.data;
      if (res.code === 200 && res.data) {
        const data = res.data;
        var allX = data.all_x;
        var allY = data.all_y;
        var dayX = data.day_x;
        var dayY = data.day_y;
        allChart.setOption({
          xAxis: {
            data: allX
          },
          series: [
            {
              data: allY
            }
          ]
        });
        dayChart.setOption({
          xAxis: {
            data: dayX
          },
          series: [
            {
              data: dayY
            }
          ]
        })
      }
    });
  }
}
</script>

<style>

</style>