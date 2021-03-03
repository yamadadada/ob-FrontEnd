<template>
    <div>
        <div class="bili-header" v-loading="loading" style="padding-top: 1%">
            <el-radio-group v-model="currentFund" @change="fundChange">
                <el-radio v-for="fund in fundList" :key="fund.id" :label="fund.id">{{ fund.id + ' ' + fund.name }}</el-radio>
            </el-radio-group>
        </div>
        <div id="realChart" :style="'height:' + chartHeight + ';width:' + chartWidth"></div>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="region" label="地区" width="180"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="status" label="状态" width="180"></el-table-column>
            <el-table-column prop="percent" label="今日涨跌" width="180"></el-table-column>
        </el-table>
    </div>
</template>

<script>
var realChartDom = document.getElementById('realChart');
var realChart;

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
            loading: false,
            fundList: [],
            currentFund: 0,
            timeList: [],
            valueList: [],
            yesterday: '',
            currentPercentChange: '',
            time: ''
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
        realChart = this.$echarts.init(realChartDom);

        const that = this;
        this.$axios.get(this.COMMON.chives_host + '/fund').then(function(res) {
            res = res.data;
            if (res.code === 200 && res.data) {
                that.fundList = res.data;
            }
        })
    },
    methods: {
        fundChange() {
            const that = this;
            this.$axios.get(this.COMMON.chives_host + '/fund/today/' + this.currentFund).then(function(res) {
                res = res.data;
                if (res.code === 200 && res.data) {
                    that.timeList = res.data.timeList;
                    that.valueList = res.data.valueList;
                    that.yesterday = res.data.yesterday;
                    realChart.setOption(realOption);
                }
            })

            this.$axios.get(this.COMMON.chives_host + '/fund/real/' + this.currentFund).then(function(res) {
                res = res.data;
                if (res.code === 200 && res.data) {
                    that.currentPercentChange = res.data.ext;
                    that.time = res.data.time;

                }
            })
        },
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
