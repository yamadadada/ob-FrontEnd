<template>
    <div>
        <div class="bili-header" style="padding-top: 1%">
            <el-radio-group v-model="currentFund" @change="fundChange">
                <el-radio v-for="fund in fundList" :key="fund.id" :label="fund.id">{{ fund.id + ' ' + fund.name }}</el-radio>
            </el-radio-group>
        </div>
        <el-row>
            <el-col :span="20" :offset="2">
                <div id="realChart" :style="'height:' + chartHeight + ';width:' + chartWidth"></div>
                <el-row>
                    <el-col :span="18" :offset="3">
                        <div style="margin: auto 0; padding-top: 10px">
                            <span>{{ yesterday + '净值：' }}</span>
                            <span v-if="yesterdayValue > 0" style="color: red">{{ yesterdayValue + '%' }}</span>
                            <span v-else-if="yesterdayValue < 0" style="color: green">{{ yesterdayValue + '%' }}</span>
                            <span v-else>{{ yesterdayValue + '%' }}</span>
                        </div>
                        <div style="margin: auto 0; padding-top: 10px;">
                            <span>{{ time + '估算净值：' }}</span>
                            <span v-if="currentPercentChange > 0" ref="currentChange" style="color: red">{{ currentPercentChange + '%' }}</span>
                            <span v-else-if="currentPercentChange < 0" ref="currentChange" style="color: green">{{ currentPercentChange + '%' }}</span>
                            <span v-else ref="currentChange">{{ currentPercentChange + '%' }}</span>
                        </div>
                        <div style="padding-top: 10px; text-align: right">
                            <i v-if="showLoading" class="el-icon-loading"></i>
                            <span v-if="isAutoRefresh">{{ refreshTime + '秒后刷新' }}</span>
                            <span v-else>周末愉快~</span>
                        </div>
                        <el-table :data="stockList" stripe style="width: 100%; margin: 0 auto;" :default-sort = "{prop: 'percent', order: 'descending'}" highlight-current-row current-row-key="stockId">
                            <el-table-column prop="region" label="地区" sortable align="center"></el-table-column>
                            <el-table-column prop="stockName" label="名称" sortable align="center"></el-table-column>
                            <el-table-column prop="statusName" label="状态" sortable align="center">
                                <template slot-scope="scope">
                                    <el-tag v-if="scope.row.statusName === '交易中'" type="success">{{ scope.row.statusName}}</el-tag>
                                    <el-tag v-else-if="scope.row.statusName === '盘前交易' || scope.row.statusName === '盘后交易'">{{ scope.row.statusName}}</el-tag>
                                    <el-tag v-else type="info">{{ scope.row.statusName}}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="current" label="当前" sortable align="center"></el-table-column>
                            <el-table-column prop="chg" label="涨跌" sortable align="center">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.chg > 0" :id="'chg-' + scope.row.stockId" style="color: red">{{ scope.row.chg }}</span>
                                    <span v-if="scope.row.chg == 0" :id="'chg-' + scope.row.stockId">{{ scope.row.chg }}</span>
                                    <span v-if="scope.row.chg < 0" :id="'chg-' + scope.row.stockId" style="color: green">{{ scope.row.chg }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="percent" label="今日涨跌" sortable align="center">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.percent > 0" :id="'percent-' + scope.row.stockId" style="color: red">{{ scope.row.percent.toFixed(2) + '%'}}</span>
                                    <span v-if="scope.row.percent == 0" :id="'percent-' + scope.row.stockId">{{ scope.row.percent.toFixed(2) + '%' }}</span>
                                    <span v-if="scope.row.percent < 0" :id="'percent-' + scope.row.stockId" style="color: green">{{ scope.row.percent.toFixed(2) + '%' }}</span>
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
            label: {
                backgroundColor: '#283b56'
            }
        }
    },
    title: {
        text: ''
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
            fundList: [],
            currentFund: 0,
            yesterday: '',
            yesterdayValue: '',
            currentPercentChange: '',
            time: '',
            stockList: [],
            refreshTime: 60,
            showLoading: false,
            isAutoRefresh: false
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
            } else {
                this.$message.error(res.msg);
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
                    realOption.title.text = res.data.today + '净值估算';
                    that.yesterday = res.data.yesterday;
                    that.yesterdayValue = res.data.yesterdayValue;
                    realChart.setOption(realOption);
                } else {
                    this.$message.error(res.msg);
                }
            })

            this.$axios.get(this.COMMON.chives_host + '/fund/real/' + this.currentFund).then(function(res) {
                res = res.data;
                if (res.code === 200 && res.data) {
                    that.currentPercentChange = res.data.currentChange;
                    that.time = res.data.time;
                    that.stockList = res.data.fundStockList;

                    if (res.data.refresh) {
                        that.isAutoRefresh = true;
                        setInterval(that.autoRefresh, 1000);
                    } else {
                        that.isAutoRefresh = false;
                    }
                } else {
                    this.$message.error(res.msg);
                }
            })
        },

        autoRefresh() {
            this.refreshTime = this.refreshTime - 1;
            if (this.refreshTime === 0) {
                this.refreshTime = 60;
                this.showLoading = true;
                const that = this;
                this.$axios.get(this.COMMON.chives_host + '/fund/real/' + this.currentFund).then(function(res) {
                    res = res.data;
                    if (res.code === 200 && res.data) {
                        var oldCurrent = that.currentPercentChange;
                        that.currentPercentChange = res.data.currentChange;
                        that.time = res.data.time;
                        var oldList = JSON.parse(JSON.stringify(that.stockList))
                        that.stockList = res.data.fundStockList;

                        realOption.xAxis[0].data.push(res.data.time);
                        realOption.series[0].data.push(res.data.currentChange);

                        realChart.setOption(realOption);

                        that.showLoading = false;
                        that.addClass(oldCurrent, that.currentPercentChange, oldList, that.stockList);
                    } else {
                        that.showLoading = false;
                        that.$message.error(res.msg);
                    }
                })
            }
        },

        addClass(oldCurrent, newCurrent, oldList, newList) {
            if (parseFloat(oldCurrent) < parseFloat(newCurrent)) {
                this.$refs.currentChange.setAttribute('class', 'up');
            } else if (parseFloat(oldCurrent) > parseFloat(newCurrent)) {
                this.$refs.currentChange.setAttribute('class', 'down');
            }

            var domList = [];
            for (var index in newList) {
                var oldChg = newList[index].chg;
                for (var i in oldList) {
                    if (oldList[i].stockId == newList[index].stockId) {
                        oldChg = oldList[i].chg;
                        break;
                    }
                }
                if (oldChg != newList[index].chg) {
                    var dom1 = document.getElementById("chg-" + newList[index].stockId).parentNode.parentNode;
                    var dom2 = document.getElementById("percent-" + newList[index].stockId).parentNode.parentNode;
                    domList.push(dom1);
                    domList.push(dom2);
                    var oldClass1 = dom1.getAttribute('class')
                    var oldClass2 = dom2.getAttribute('class')
                    if (oldChg < newList[index].chg) {
                        dom1.setAttribute('class', oldClass1 + ' up');
                        dom2.setAttribute('class', oldClass2 + ' up');
                    } else {
                        dom1.setAttribute('class', oldClass1 + ' down');
                        dom2.setAttribute('class', oldClass2 + ' down');
                    }
                }
            }

            var that = this;
            setTimeout(function() {
                that.clearClass(domList)
            }, 3000);
        },

        clearClass(domList) {
            this.$refs.currentChange.setAttribute('class', '');

            for (var index in domList) {
                var dom = domList[index];
                var oldClass = dom.getAttribute('class')
                dom.setAttribute('class', oldClass.replace('up', '').replace('down', ''));
            }
        }
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
.up {
    animation-name: up;
    animation-duration: 3s;
}
.down {
    animation-name: down;
    animation-duration: 3s;
}

@keyframes up {
  0%   {background-color: white;}
  25%  {background-color: #FCDEDE;}
  75%  {background-color: #FCDEDE;}
  100%  {background-color: white;}
}
@keyframes down {
  0%   {background-color: white;}
  25%  {background-color: #C2F2C2;}
  75%  {background-color: #C2F2C2;}
  100%  {background-color: white;}
}
</style>
