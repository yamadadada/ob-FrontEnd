<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :span="22">
      <el-row>
        <el-col :span="3" v-for="game in gameList" :key="game.gid" :offset="1">
          <router-link :to="'/game/' + game.gid">
            <el-card :body-style="{ padding: '0px' }" class="card" shadow="hover">
              <img :src="game.huya" class="image">
              <div style="padding: 14px;">
                <span>{{game.game}}</span>
                <div class="bottom">
                  当前观看：{{game.total.toFixed(0)}}人
                </div>
              </div>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
      <el-button @click="nextPage" type="text" :disabled="disabled">
        {{message}}
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "Game",
  data () {
    return {
      gameList: [],
      page: 1,
      size: 30,
      totalPage: 0,
      message: '加载更多',
      disabled: false
    }
  },
  created () {
    var that = this;
    this.$axios.get('httP://111.230.220.64:8081/game?page=' + this.page + "&size=" + this.size).then(function(res) {
      res = res.data;
      if (res.code === 200 && res.data) {
        that.gameList = res.data.gameVOList;
        that.page = res.data.page;
        that.size = res.data.size;
        that.totalPage = res.data.totalPage;
      }
    })
  },
  methods: {
    nextPage: function () {
      this.disabled = true;
      this.message = '加载中...';
      var p = this.page + 1;
      var that = this;
      this.$axios.get('httP://111.230.220.64:8081/game?page=' + p + "&size=" + this.size).then(function(res) {
        res = res.data;
        if (res.code === 200 && res.data) {
          that.gameList = that.gameList.concat(res.data.gameVOList);
          that.page = res.data.page;
          that.size = res.data.size;
          that.totalPage = res.data.totalPage;
          that.message = that.page < that.totalPage ? '加载更多' : '没有更多了';
          that.disabled = that.page < that.totalPage ? false : true;
        }
      })
    }
  }
}
</script>

<style>
.card {
  margin-bottom: 10px;
  height: 330px;
}
.image {
  width: 100%;
  height: 260px;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
  font-size: 13px;
  text-align: left;
  color: #999;
}
a {
  text-decoration: none;
}
</style>