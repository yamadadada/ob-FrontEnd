<template>
    <div>
        <div class="bili-header" v-loading="loading" style="padding-top: 1%">
            <el-radio-group v-model="radioUser" @change="radioUserChange">
                <el-radio v-for="user in userList" :key="user" :label="user">{{user}}</el-radio>
            </el-radio-group>
        </div>
        <div id="realChart" :style="'height:' + chartHeight + ';width:' + chartWidth"></div>
    </div>
</template>

<script>
var realOption = {
    title: {
        text: '净值估算',
        subtext: '2021-02-21'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#283b56'
            }
        }
    },
    legend: {
        data:['涨跌幅']
    },
    toolbox: {
        show: true,
        feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
        }
    },
    dataZoom: {
        show: false,
        start: 0,
        end: 100
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: true,
            data: (function (){
                var now = new Date();
                var res = [];
                var len = 10;
                while (len--) {
                    res.unshift(now.toLocaleTimeString().replace(/^\D*/,''));
                    now = new Date(now - 2000);
                }
                return res;
            })()
        }
    ],
    yAxis: [
        {
            type: 'value',
            scale: true,
            name: '涨跌幅',
            max: 'dataMax',
            min: 'dataMin',
            boundaryGap: [0.2, 0.2]
        }
    ],
    series: [
        {
            name: '涨跌幅',
            type: 'line',
            data: (function (){
                var res = [];
                var len = 0;
                while (len < 10) {
                    res.push((Math.random()*10 + 5).toFixed(1) - 0);
                    len++;
                }
                return res;
            })()
        }
    ]
};

export default {
    name: 'Fund',
    data () {
        return {
            fundList: [],
            loading: false
        }
    },
    computed: {
        chartHeight: function() {
            return document.documentElement.clientHeight + 'px';
        },
        chartWidth: function() {
            return document.body.clientWidth + 'px';
        }
    },
    mounted () {
        var realChartDom = document.getElementById('realChart');
        var realChart = this.$echarts.init(realChartDom);

    }
}
</script>

<style>
.bili-header {
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    width: 80%; 
    margin: auto;
    padding-bottom: 1%;
    margin-bottom: 1%;
    margin-top: 1%;
}
</style>
