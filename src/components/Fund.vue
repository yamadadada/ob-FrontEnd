<template>
    <div>
        <div class="bili-header" v-loading="loading" style="padding-top: 1%">
            <el-radio-group v-model="currentFund" @change="fundChange">
                <el-radio v-for="fund in fundList" :key="fund.id" :label="fund.id">{{ fund.id + ' ' + fund.name }}</el-radio>
            </el-radio-group>
        </div>
        <el-row>
            <el-col :span="20" :offset="2">
                <div id="realChart" :style="'height:' + chartHeight + ';width:' + chartWidth"></div>
                <el-row>
                    <el-col :span="18" :offset="3">
                        <el-table :data="stockList" stripe style="width: 100%; margin: 0 auto;" :default-sort = "{prop: 'percent', order: 'descending'}">
                            <el-table-column prop="region" label="地区" sortable></el-table-column>
                            <el-table-column prop="stockName" label="名称" sortable></el-table-column>
                            <el-table-column prop="statusName" label="状态" sortable>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.statusName == '交易中'" style="color: red">{{ scope.row.statusName}}</span>
                                    <span v-else>{{ scope.row.statusName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="current" label="当前" sortable></el-table-column>
                            <el-table-column prop="chg" label="涨跌" sortable>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.chg > 0" style="color: red">{{ scope.row.chg }}</span>
                                    <span v-if="scope.row.chg == 0">{{ scope.row.chg }}</span>
                                    <span v-if="scope.row.chg < 0" style="color: green">{{ scope.row.chg }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="percent" label="今日涨跌" sortable>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.percent > 0" style="color: red">{{ scope.row.percent.toFixed(2) + '%'}}</span>
                                    <span v-if="scope.row.percent == 0">{{ scope.row.percent.toFixed(2) + '%' }}</span>
                                    <span v-if="scope.row.percent < 0" style="color: green">{{ scope.row.percent.toFixed(2) + '%' }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
var realChart;

var realOption = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#283b56'
            }
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
            splitLine: {
                show: false
            }
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
            smooth: true,
            itemStyle: {
                normal: {
                    color: '#409EFF'
                }
            },
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
            yesterday: '',
            currentPercentChange: '',
            time: '',
            stockList: []
        }
    },
    computed: {
        chartHeight: function() {
            return 0.8 * document.documentElement.clientHeight + 'px';
        },
        chartWidth: function() {
            return 0.85 * document.body.clientWidth + 'px';
        }
    },
    mounted () {
        realChart = this.$echarts.init(document.getElementById('realChart'));

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
                    realOption.xAxis[0].data = res.data.timeList;
                    realOption.series[0].data = res.data.valueList;
                    that.yesterday = res.data.yesterday;
                    realChart.setOption(realOption);
                }
            })

            this.$axios.get(this.COMMON.chives_host + '/fund/real/' + this.currentFund).then(function(res) {
                res = res.data;
                if (res.code === 200 && res.data) {
                    that.currentPercentChange = res.data.ext;
                    that.time = res.data.time;
                    that.stockList = res.data.fundStockList;
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
