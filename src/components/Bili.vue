<template>
    <div>
        <el-tabs type="card" stretch>
            <el-tab-pane label="每日粉丝数">
                <div class="bili-header" v-loading="loading">
                    <el-button type="text" @click="clearCheckbox">清空</el-button>
                    <el-checkbox-group v-model="checkUserList" @change="handleCheckedChange">
                        <el-checkbox v-for="user in userList" :label="user" :key="user">{{user}}</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div id="chart" :style="'height:' + chartHeight + ';width:' + chartWidth"></div>
            </el-tab-pane>
            <el-tab-pane label="每十分钟粉丝数">
                <div class="bili-header" v-loading="loading">
                    <el-button type="text" @click="clearCheckbox">清空</el-button>
                    <el-checkbox-group v-model="checkUserList" @change="handleCheckedChange">
                        <el-checkbox v-for="user in userList" :label="user" :key="user">{{user}}</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div id="shortChart" :style="'height:' + chartHeight + ';width:' + chartWidth"></div>
            </el-tab-pane>
            <el-tab-pane label="累积增长粉丝">
                <div class="bili-header" v-loading="loading">
                    <el-button type="text" @click="clearCheckbox5">清空</el-button>
                    <el-checkbox-group v-model="checkUserList5" @change="handleCheckedChange5">
                        <el-checkbox v-for="user in userList" :label="user" :key="user">{{user}}</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div id="accumulationChart" :style="'height:' + chartHeight + ';width:' + chartWidth"></div>
            </el-tab-pane>
            <el-tab-pane label="变化速率">
                <div class="bili-header" v-loading="loading" style="padding-top: 1%">
                    <el-radio-group v-model="radioUser" @change="radioUserChange">
                        <el-radio v-for="user in userList" :key="user" :label="user">{{user}}</el-radio>
                    </el-radio-group>
                </div>
                <div id="changeChart" :style="'height:' + chartHeight + ';width:' + chartWidth"></div>
            </el-tab-pane>
            <el-tab-pane label="变化日历">
                <div class="bili-header" v-loading="loading" style="padding-top: 1%">
                    <el-radio-group v-model="radioUser" @change="radioUserChange">
                        <el-radio v-for="user in userList" :key="user" :label="user">{{user}}</el-radio>
                    </el-radio-group>
                </div>
                <div id="calendarChart" :style="'height:' + chartHeight + ';width:' + chartWidth"></div>
            </el-tab-pane>
        </el-tabs>
        <el-dialog title="选择日期范围" :visible.sync="dialogFormVisible" center>
            <el-row>
                 <el-col :span="8" :offset="7">
                    <el-date-picker :editable="false"
                        v-model="dateValue"
                        type="daterange"
                        align="center"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        :default-time="['00:00:00', '23:59:59']"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="timestamp">
                    </el-date-picker>
                 </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogConfirm()">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="选择日期" :visible.sync="dialogFormVisible1" center>
            <el-row>
                 <el-col :span="8" :offset="7">
                    <el-date-picker :editable="false"
                        v-model="dateValue1"
                        type="date"
                        align="center"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        :picker-options="pickerOptions1"
                        value-format="timestamp">
                    </el-date-picker>
                 </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="dialogConfirm1()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

var chart;
var shortChart;
var changeChart;
var calendarChart;
var accumulationChart;

const option1 = {
    tooltip: {
        trigger: 'axis',
        confine: true,
        position: function (point) {
            return [point[0] - 150, point[1] + 30];
        }
    },
    title: {
        text: '每日0点粉丝数',
        subtext: '部分数据来源于biliob.com',
        sublink: 'https://www.biliob.com/'
    },
    xAxis: {
        type: 'category',
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        min: 'dataMin',
        max: 'dataMax'
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
    grid: {
        left: '7%',
        right: '8%'
    }
}

const option2 = {
    toolbox: {
        feature: {
            myTool1: {
                show: true,
                title: '选择日期',
                icon: 'path://M471.36 806.048h83.424a27.808 27.808 0 1 0 0-55.616H471.36a27.808 27.808 0 1 0 0 55.616z m389.312-681.28H700.8V96.96a27.808 27.808 0 1 0-55.616 0v27.808h-264.16V96.96a27.808 27.808 0 1 0-55.616 0v27.808H165.536a97.28 97.28 0 0 0-97.344 97.344v639.584a97.312 97.312 0 0 0 97.344 97.344h695.168a97.28 97.28 0 0 0 97.344-97.344V222.112a97.312 97.312 0 0 0-97.344-97.344zM902.4 861.664c0 23.072-18.656 41.728-41.728 41.728H165.504a41.696 41.696 0 0 1-41.728-41.728V409.792H902.4v451.872z m0-507.488H123.776V222.08c0-23.072 18.656-41.728 41.728-41.728h159.872v41.696a27.808 27.808 0 1 0 55.616 0V180.352h264.16v41.696a27.808 27.808 0 1 0 55.616 0V180.352h159.872c23.072 0 41.728 18.656 41.728 41.728v132.096z m-681.312 201.6h83.424a27.808 27.808 0 1 0 0-55.616H221.088a27.808 27.808 0 1 0 0 55.616z m250.272 0h83.424a27.808 27.808 0 1 0 0-55.616H471.36a27.808 27.808 0 1 0 0 55.616z m250.272 0h83.424a27.808 27.808 0 1 0 0-55.616h-83.424a27.808 27.808 0 1 0 0 55.616zM221.088 680.928h83.424a27.808 27.808 0 1 0 0-55.616H221.088a27.808 27.808 0 1 0 0 55.616z m250.272 0h83.424a27.808 27.808 0 1 0 0-55.616H471.36a27.808 27.808 0 1 0 0 55.616z m250.272 0h83.424a27.808 27.808 0 1 0 0-55.616h-83.424a27.808 27.808 0 1 0 0 55.616z m-500.544 125.12h83.424a27.808 27.808 0 1 0 0-55.616H221.088a27.808 27.808 0 1 0 0 55.616z m500.544 0h83.424a27.808 27.808 0 1 0 0-55.616h-83.424a27.808 27.808 0 1 0 0 55.616z',
                onclick: function () {
                    window.changeDialogVisable();
                }
            },
            restore: {},
            saveAsImage: {}
        },
        right: '7%'
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        position: function (point) {
            return [point[0] - 150, point[1] + 30];
        }
    },
    title: {
        text: '每10分钟粉丝数'
    },
    xAxis: {
        type: 'category',
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        min: 'dataMin',
        max: 'dataMax'
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
    grid: {
        left: '7%',
        right: '8%'
    }
}

const option5 = {
    toolbox: {
        feature: {
            myTool1: {
                show: true,
                title: '选择日期',
                icon: 'path://M471.36 806.048h83.424a27.808 27.808 0 1 0 0-55.616H471.36a27.808 27.808 0 1 0 0 55.616z m389.312-681.28H700.8V96.96a27.808 27.808 0 1 0-55.616 0v27.808h-264.16V96.96a27.808 27.808 0 1 0-55.616 0v27.808H165.536a97.28 97.28 0 0 0-97.344 97.344v639.584a97.312 97.312 0 0 0 97.344 97.344h695.168a97.28 97.28 0 0 0 97.344-97.344V222.112a97.312 97.312 0 0 0-97.344-97.344zM902.4 861.664c0 23.072-18.656 41.728-41.728 41.728H165.504a41.696 41.696 0 0 1-41.728-41.728V409.792H902.4v451.872z m0-507.488H123.776V222.08c0-23.072 18.656-41.728 41.728-41.728h159.872v41.696a27.808 27.808 0 1 0 55.616 0V180.352h264.16v41.696a27.808 27.808 0 1 0 55.616 0V180.352h159.872c23.072 0 41.728 18.656 41.728 41.728v132.096z m-681.312 201.6h83.424a27.808 27.808 0 1 0 0-55.616H221.088a27.808 27.808 0 1 0 0 55.616z m250.272 0h83.424a27.808 27.808 0 1 0 0-55.616H471.36a27.808 27.808 0 1 0 0 55.616z m250.272 0h83.424a27.808 27.808 0 1 0 0-55.616h-83.424a27.808 27.808 0 1 0 0 55.616zM221.088 680.928h83.424a27.808 27.808 0 1 0 0-55.616H221.088a27.808 27.808 0 1 0 0 55.616z m250.272 0h83.424a27.808 27.808 0 1 0 0-55.616H471.36a27.808 27.808 0 1 0 0 55.616z m250.272 0h83.424a27.808 27.808 0 1 0 0-55.616h-83.424a27.808 27.808 0 1 0 0 55.616z m-500.544 125.12h83.424a27.808 27.808 0 1 0 0-55.616H221.088a27.808 27.808 0 1 0 0 55.616z m500.544 0h83.424a27.808 27.808 0 1 0 0-55.616h-83.424a27.808 27.808 0 1 0 0 55.616z',
                onclick: function () {
                    window.changeDialogVisable1();
                }
            },
            saveAsImage: {}
        },
        right: '7%'
    },
    tooltip: {
        trigger: 'axis',
        confine: true,
        position: function (point) {
            return [point[0] - 150, point[1] + 30];
        }
    },
    title: {
        text: '累积增长粉丝数'
    },
    xAxis: {
        type: 'category',
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        min: 'dataMin',
        max: 'dataMax'
    },
    dataZoom: [{
        type: 'inside',
        start: 0,
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
    grid: {
        left: '7%',
        right: '8%'
    }
}

const option3 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        },
        confine: true,
        position: function (point) {
            return [point[0] - 150, point[1] + 30];
        }
    },
    title: {
        text: '每日粉丝变化率',
        subtext: '部分数据来源于biliob.com',
        sublink: 'https://www.biliob.com/'
    },
    xAxis: {
        type: 'category',
        axisTick: {
            alignWithLabel: true
        }
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        min: 'dataMin',
        max: 'dataMax',
        axisLabel: {
            textStyle: {
                color: '#999'
            }
        }
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
    animationEasing: 'elasticOut',
    animationDelayUpdate: function (idx) {
        return idx * 2;
    },
    grid: {
        left: '5%',
        right: '7%'
    }
}

const option4 = {
    tooltip: {
        formatter: params => {
          return params.value[0] + '<br/>' + params.marker + params.value[1]
        },
        confine: true
    },
    animation: true,
    visualMap: {
        show: false,
        inRange: {
            color: "#409EFF",
            colorAlpha: [0.2, 1]
        },
        outOfRange: {
            color: "#333",
            colorAlpha: [1, 0]
        }
    }
}

export default {
    name: 'Bili',
    data () {
        return {
            checkUserList: ['★⑥檤轮囬★'],
            checkUserList5: ['★⑥檤轮囬★'],
            userList: [],
            dict1: {},
            dict2: {},
            dict3: {},
            dict5: {},
            allSeries1: [],
            allSeries2: [],
            loading: false,
            dialogFormVisible: false,
            dialogFormVisible1: false,
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }],
                disabledDate(time) {
                    var t = new Date(time.getTime());
                    t.setHours(0);
                    t.setMinutes(0);
                    t.setSeconds(0);
                    t.setMilliseconds(0);
                    return t.getTime() > new Date().getTime() || t.getTime() < 1583164800000
                }
            },
            pickerOptions1: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                    picker.$emit('pick', new Date(new Date().setHours(0, 0, 0, 0)));
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                    const date = new Date(new Date().setHours(0, 0, 0, 0));
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                    const date = new Date(new Date().setHours(0, 0, 0, 0));
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                    }
                }]
            },
            dateValue: [new Date().getTime() - 2592000000, new Date().getTime()],
            // dateValue1: new Date(new Date().getTime()).setHours(0, 0, 0, 0),
            dateValue1: new Date().setHours(0, 0, 0, 0),
            startDate: new Date().getTime() - 2592000000,
            endDate: new Date().getTime(),
            radioUser: '',
            accumulationDate: new Date(new Date().getTime()).setHours(0, 0, 0, 0)
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
        this.loading = true;
        const that = this;
        window['changeDialogVisable'] = () => {
            this.dialogFormVisible = !this.dialogFormVisible;
        }
        window['changeDialogVisable1'] = () => {
            this.dialogFormVisible1 = !this.dialogFormVisible1;
        }
        chart = this.$echarts.init(document.getElementById('chart'));
        shortChart = this.$echarts.init(document.getElementById('shortChart'));
        changeChart = this.$echarts.init(document.getElementById('changeChart'));
        calendarChart = this.$echarts.init(document.getElementById('calendarChart'));
        accumulationChart = this.$echarts.init(document.getElementById('accumulationChart'));
        chart.showLoading({  
            color: '#409EFF'
        })
        shortChart.showLoading({  
            color: '#409EFF'
        })
        chart.setOption(option1);
        shortChart.setOption(option2);
        accumulationChart.setOption(option5);
        var timeList = [];
        var tempTime = this.accumulationDate;
        while (tempTime < new Date().getTime() && tempTime <= 86400000) {
            var d = new Date(tempTime);
            timeList.push(d.getFullYear + '-' + d.getMonth() + '-' + d.getDate() + ' ' + d.getHours + '-' + (d.getMinutes() < 10 ? '00' : d.getMinutes()));
            tempTime += 600000;
        }
        accumulationChart.setOption({
            xAxis: {
                data: timeList
            },
        })
        new Promise((resolve, reject) => {
            this.$axios.get(this.COMMON.host + '/bili/userList').then(function(res) {
                res = res.data;
                if (res.code === 200 && res.data) {
                    const data = res.data;
                    var list = [];
                    var dict1 = {};
                    var dict2 = {};
                    var dict3 = {};
                    var dict5 = {};
                    for (var i in data) {
                        list.push(data[i].name);
                        dict1[data[i].name] = {'uid': data[i].uid, 'data': null};
                        dict2[data[i].name] = {'uid': data[i].uid, 'data': null};
                        dict3[data[i].name] = {'uid': data[i].uid, 'data': null};
                        dict5[data[i].name] = {'uid': data[i].uid, 'data': null};
                    }
                    that.userList = list;
                    that.dict1 = dict1;
                    that.dict2 = dict2;
                    that.dict3 = dict3;
                    that.dict5 = dict5;
                    that.loading = false;
                    resolve();
                } else {
                    reject();
                }
            })
        }).then(() => {
            this.$axios.get(this.COMMON.host + '/bili/all/295723').then(function(res) {
                res = res.data;
                if (res.code === 200 && res.data) {
                    const data = res.data;
                    that.dict1['★⑥檤轮囬★']['data'] = data;
                    const series = {
                        name: '★⑥檤轮囬★',
                        type: 'line',
                        smooth: true,
                        connectNulls: true,
                        itemStyle: {
                            normal: {
                                color: '#409EFF'
                            }
                        },
                        data: data.value_list
                    }
                    that.allSeries1.push(series);
                    chart.setOption({
                        xAxis: {
                            data: data.time_list
                        },
                        series: that.allSeries1
                    });
                    chart.hideLoading();
                }
            });
            this.$axios.get(this.COMMON.host + '/bili/short/295723?start=' + this.startDate + '&end=' + this.endDate).then(function(res) {
                res = res.data;
                if (res.code === 200 && res.data) {
                    const data = res.data;
                    that.dict2['★⑥檤轮囬★']['data'] = data;
                    const series = {
                        name: '★⑥檤轮囬★',
                        type: 'line',
                        smooth: true,
                        connectNulls: true,
                        itemStyle: {
                            normal: {
                                color: '#409EFF'
                            }
                        },
                        data: data.value_list
                    }
                    that.allSeries2.push(series);
                    shortChart.setOption({
                        xAxis: {
                            data: data.time_list
                        },
                        series: that.allSeries2
                    });
                    shortChart.hideLoading();
                    that.changeChart5(['★⑥檤轮囬★'])
                }
            });
        })
    },
    methods: {
        clearCheckbox() {
            this.checkUserList = [];
            this.changeChart1([]);
            this.changeChart2([]);
        },

        clearCheckbox5() {
            this.checkUserList5 = [];
            this.changeChart5([]);
        },

        handleCheckedChange(value) {
            this.changeChart1(value);
            this.changeChart2(value);
        },

        handleCheckedChange5(checkNameList) {
            this.changeChart5(checkNameList);
        },

        changeChart1(value) {
            chart.showLoading({  
                color:'#409EFF'
            })
            chart.clear();
            chart.setOption(option1)
            var promiseList = [];
            var newSeries = [];
            for (var index in value) {
                const i = this.allSeries1.indexOf(value[index]);
                if (i >= 0) {
                    newSeries.push(this.allSeries1[i]);
                } else {
                    promiseList.push(this.getData1(index, value, newSeries));
                }
            }
            const that = this;
            Promise.all(promiseList).then(function() {
                var minTime = null;
                for (var index2 in value) {
                    const item = that.dict1[value[index2]];
                    if (minTime == null || minTime > item['data'].min_time) {
                        minTime = item['data'].min_time;
                        chart.setOption({
                            xAxis: {
                                data: item['data'].time_list
                            }
                        })
                    }
                }
                that.allSeries1 = newSeries;
                chart.setOption({
                    series: newSeries
                })
                chart.hideLoading();
            })
        },

        changeChart2(value) {
            shortChart.showLoading({  
                color:'#409EFF'
            })
            shortChart.clear();
            shortChart.setOption(option2)
            var promiseList = [];
            var newSeries = [];
            for (var index in value) {
                const i = this.allSeries2.indexOf(value[index]);
                if (i >= 0) {
                    newSeries.push(this.allSeries2[i]);
                } else {
                    promiseList.push(this.getData2(index, value, newSeries));
                }
            }
            const that = this;
            Promise.all(promiseList).then(function() {
                var minTime = null;
                for (var index2 in value) {
                    const item = that.dict2[value[index2]];
                    if (minTime == null || minTime > item['data'].min_time) {
                        minTime = item['data'].min_time;
                        shortChart.setOption({
                            xAxis: {
                                data: item['data'].time_list
                            },
                        })
                    }
                }
                that.allSeries2 = newSeries;
                shortChart.setOption({
                    series: newSeries
                })
                shortChart.hideLoading();
            })
        },

        changeChart5(checkNameList) {
            accumulationChart.showLoading({  
                color:'#409EFF'
            })
            accumulationChart.clear();
            accumulationChart.setOption(option5);
            accumulationChart.setOption({
                legend: {
                    data: checkNameList
                }
            })
            var promiseList = [];
            var newSeries = [];
            for (var index in checkNameList) {
                const name = checkNameList[index];
                if (this.dict5[name]['data'] != null) {
                    newSeries.push({
                        name: name,
                        type: 'line',
                        smooth: true,
                        connectNulls: true,
                        data: this.dict5[name]['data']
                    })
                    continue;
                }
                if (this.dict2[name].data == null) {
                    promiseList.push(this.getData5(name, newSeries));
                } else {
                    const valueList = this.dict2[name]['data']['value_list'];
                    var base = 0;
                    var resultList = [];
                    for (var i in valueList) {
                        var time = new Date(valueList[i][0]).getTime();
                        if (time == this.accumulationDate) {
                            base = valueList[i][1];
                            resultList.push([valueList[i][0], 0]);
                        } else if (time > this.accumulationDate && time < this.accumulationDate + 86400000) {
                            resultList.push([valueList[i][0], valueList[i][1] - base]);
                        }
                    }
                    if (resultList.length > 0) {
                        this.dict5[name]['data'] = resultList;
                        newSeries.push({
                            name: name,
                            type: 'line',
                            smooth: true,
                            connectNulls: true,
                            data: resultList
                        })
                    } else {
                        promiseList.push(this.getData5(name, newSeries));
                    }
                }
            }
            Promise.all(promiseList).then(function() {
                accumulationChart.setOption({
                    series: newSeries
                })
                accumulationChart.hideLoading();
            })
        },

        getData1(index, value, newSeries) {
            const that = this;
            return new Promise((resolve, reject) => {
                const item = that.dict1[value[index]]
                if (item['data'] == null) {
                    that.$axios.get(that.COMMON.host + '/bili/all/' + item['uid']).then(function(res) {
                        res = res.data;
                        if (res.code === 200 && res.data) {
                            const data = res.data;
                            item['data'] = data;
                            const series = {
                                name: value[index],
                                type: 'line',
                                smooth: true,
                                connectNulls: true,
                                data: data.value_list
                            }
                            if (value.length == 1) {
                                series['itemStyle'] = {color: '#409EFF'}
                            }
                            newSeries.push(series);
                            resolve();
                        } else {
                            reject();
                        }
                    });
                } else {
                    const series = {
                        name: value[index],
                        type: 'line',
                        smooth: true,
                        connectNulls: true,
                        data: item['data'].value_list
                    }
                    if (value.length == 1) {
                        series['itemStyle'] = {color: '#409EFF'}
                    }
                    newSeries.push(series);
                    resolve();
                }
            })
        },

        getData2(index, value, newSeries) {
            const that = this;
            return new Promise((resolve, reject) => {
                const item = that.dict2[value[index]]
                if (item['data'] == null) {
                    that.$axios.get(that.COMMON.host + '/bili/short/' + item['uid'] + '?start=' + that.startDate + '&end=' + that.endDate).then(function(res) {
                        res = res.data;
                        if (res.code === 200 && res.data) {
                            const data = res.data;
                            item['data'] = data;
                            const series = {
                                name: value[index],
                                type: 'line',
                                smooth: true,
                                connectNulls: true,
                                data: data.value_list
                            }
                            if (value.length == 1) {
                                series['itemStyle'] = {color: '#409EFF'}
                            }
                            newSeries.push(series);
                            resolve();
                        } else {
                            reject();
                        }
                    });
                } else {
                    const series = {
                        name: value[index],
                        type: 'line',
                        smooth: true,
                        connectNulls: true,
                        data: item['data'].value_list
                    }
                    if (value.length == 1) {
                        series['itemStyle'] = {color: '#409EFF'}
                    }
                    newSeries.push(series);
                    resolve();
                }
            })
        },

        getData5(name, newSeries) {
            const that = this;
            return new Promise((resolve, reject) => {
                that.$axios.get(that.COMMON.host + '/bili/short/' + that.dict2[name]['uid'] + '?start=' + that.accumulationDate + '&end=' + (that.accumulationDate + 86400000)).then(function(res) {
                    res = res.data;
                    if (res.code === 200 && res.data) {
                        var valueList = res.data.value_list;
                        if (valueList.length == 0) {
                            reject();
                        }
                        const base = valueList[0][1];
                        for (var i in valueList) {
                            valueList[i][1] = valueList[i][1] - base;
                        }
                        const series = {
                            name: name,
                            type: 'line',
                            smooth: true,
                            connectNulls: true,
                            data: valueList
                        }
                        that.dict5[name]['data'] = valueList;
                        newSeries.push(series);
                        resolve();
                    } else {
                        reject();
                    }
                });
            })
        },

        dialogConfirm() {
            this.dialogFormVisible = false;
            if (this.dateValue[0] != this.startDate || this.dateValue[1] != this.endDate) {
                this.startDate = this.dateValue[0];
                this.endDate = this.dateValue[1];
                for (var index in this.userList) {
                    this.dict2[this.userList[index]]['data'] = null;
                }
                this.changeChart2(this.checkUserList);
            }
        },

        dialogConfirm1() {
            this.dialogFormVisible1 = false;
            if (this.dateValue1 != this.accumulationDate) {
                this.accumulationDate = this.dateValue1;
                for (var index in this.userList) {
                    this.dict5[this.userList[index]]['data'] = null;
                }
                this.handleCheckedChange5(this.checkUserList5);
            }
        },

        radioUserChange(value) {
            changeChart.showLoading({  
                color:'#409EFF'
            })
            calendarChart.showLoading({  
                color:'#409EFF'
            })
            changeChart.clear();
            changeChart.setOption(option3);
            calendarChart.clear();
            calendarChart.setOption(option4);
            if (this.dict3[value]['data'] == null) {
                const that = this;
                const item = this.dict3[value];
                this.$axios.get(that.COMMON.host + '/bili/change/' + item['uid']).then(function(res) {
                    res = res.data;
                    if (res.code === 200 && res.data) {
                        const data = res.data;
                        item['data'] = data;
                        changeChart.setOption({
                            xAxis: {
                                data: data.time_list
                            },
                            series: [
                                {
                                    type: 'bar',
                                    itemStyle: {
                                        color: new that.$echarts.graphic.LinearGradient(
                                            0, 0, 0, 1,
                                            [
                                                {offset: 0, color: '#83bff6'},
                                                {offset: 0.5, color: '#188df0'},
                                                {offset: 1, color: '#188df0'}
                                            ]
                                        )
                                    },
                                    emphasis: {
                                        itemStyle: {
                                            color: new that.$echarts.graphic.LinearGradient(
                                                0, 0, 0, 1,
                                                [
                                                    {offset: 0, color: '#2378f7'},
                                                    {offset: 0.7, color: '#2378f7'},
                                                    {offset: 1, color: '#83bff6'}
                                                ]
                                            )
                                        }
                                    },
                                    data: data.value_list,
                                    animationDelay: function (idx) {
                                        return idx * 2;
                                    }
                                }
                            ]
                        })
                        changeChart.hideLoading();
                        that.setCalendarChart(data);
                    }
                });
            } else {
                const data = this.dict3[value]['data'];
                changeChart.setOption({
                    xAxis: {
                        data: data.time_list
                    },
                    series: [
                        {
                            type: 'bar',
                            itemStyle: {
                                color: new this.$echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#83bff6'},
                                        {offset: 0.5, color: '#188df0'},
                                        {offset: 1, color: '#188df0'}
                                    ]
                                )
                            },
                            emphasis: {
                                itemStyle: {
                                    color: new this.$echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#2378f7'},
                                            {offset: 0.7, color: '#2378f7'},
                                            {offset: 1, color: '#83bff6'}
                                        ]
                                    )
                                }
                            },
                            data: data.value_list,
                            animationDelay: function (idx) {
                                return idx * 2;
                            }
                        }
                    ]
                });
                changeChart.hideLoading();
                this.setCalendarChart(data);
            }
        },

        setCalendarChart(data) {
            var calendarTimeList = [];
            var calendarvalueList = [];
            for (var index in data.time_list) {
                const timeString = this.$echarts.format.formatTime('yyyy-M-d', data.time_list[index]);
                calendarTimeList.push(timeString);
                calendarvalueList.push([timeString, data.value_list[index]]);
            }
            var min = Math.min.apply(null, data.value_list);
            var max = Math.max.apply(null, data.value_list);
            var calendarSet = this.getCalendarSet(data.time_list, calendarvalueList);
            calendarChart.setOption({
                visualMap: {
                    min: min,
                    max: max,
                    range: [0, max]
                },
                calendar: calendarSet[0],
                series: calendarSet[1]
            })
            calendarChart.hideLoading();
        },

        getCalendarSet(time_list, calendarvalueList) {
            if (time_list.length == 0) {
                return [null, null];
            }
            const thisYear = new Date().getFullYear();
            const startYear = new Date(time_list[0]).getFullYear();
            var calendarList = [];
            var seriesList = [];
            for (var i = 0; i < (thisYear - startYear + 1); i++) {
                calendarList.push({
                    top: 200 * i + 50,
                    right: "50",
                    left: "50",
                    cellSize: ['auto', 20],
                    splitLine: false,
                    itemStyle: {
                        color: "#fff",
                        borderWidth: 1
                    },
                    yearLabel: { show: true },
                    dayLabel: { nameMap: "cn", position: "start", color: "#888", fontSize: 10 },
                    monthLabel: { nameMap: "cn", color: "#888", fontSize: 10 },
                    range: '' + (thisYear - i)
                });
                seriesList.push({
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    calendarIndex: i,
                    data: calendarvalueList
                });
            }
            return [calendarList, seriesList];
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
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
}
.el-icon-arrow-down {
    font-size: 12px;
}
</style>