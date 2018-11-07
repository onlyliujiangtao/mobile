<template>
  <div class="water">
      <flexbox class="header item_cell">
        <flexbox-item>终端名称</flexbox-item>
        <flexbox-item>交易时间</flexbox-item>
        <flexbox-item>
          <flexbox>
            <flexbox-item class="tar">交易金额</flexbox-item>
            <flexbox-item class="tar">支付渠道</flexbox-item>
          </flexbox>
        </flexbox-item>
      </flexbox>
      <scroller class="content" lock-x @on-scroll-bottom="onScrollBottom" :scroll-bottom-offset="10" ref="scrollerBottom">
        <div>
          <flexbox class="item_cell striped" v-for="(item,index) in list" :key="index" @click.native="lookDetail(index)">
            <flexbox-item>{{item.termName}}</flexbox-item>
            <flexbox-item>{{item.time}}</flexbox-item>
            <flexbox-item>
              <flexbox>
                <flexbox-item class="tar">¥{{(item.amount/100).toFixed(2)}}</flexbox-item>
                <flexbox-item class="tar">{{item.payType}}</flexbox-item>
              </flexbox>
            </flexbox-item>
          </flexbox>
          <load-more v-if="!isBottom" tip="正在加载"></load-more>
          <divider v-if="isBottom">我也是有底线的</divider>
        </div>
      </scroller>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, Cell, Divider, Scroller, LoadMore } from 'vux'
import * as request from '@/axios/api'

export default {
  components: {
    Flexbox,
    FlexboxItem,
    Cell,
    Divider,
    LoadMore,
    Scroller
  },
  data () {
    return {
      loading: true,
      isBottom: false,
      page: 1,
      num: 30,
      list: []
    }
  },
  mounted () {
    this.initData()
  },
  computed: {
    payType2Text (code) {
      switch (code) {
        case '1': return '龙支付'
        case '2': return '微信'
        case '3': return '支付宝'
        case '4': return '银联二维码'
        case '5': return '补单'
        default: return '其他支付'
      }
    }
  },
  methods: {
    async initData () {
      let params = {
        query_date: 20181106000000,
        query_e_date: 20181106235959,
        page: this.page,
        rows: 20
      }
      this.page === 1 && (this.list = [])
      let res = await request.getTranlineGrid(params)
      if (res.status) {
        res.rows.forEach(item => {
          this.list.push(item)
        })
        this.$nextTick(() => {
          this.$refs.scrollerBottom.reset()
        })
        if (res.rows.length === 0 || res.rows.length < 20) {
          this.isBottom = true
        } else {
          this.loading = true
        }
      }
    },
    lookDetail (index) {
      console.log(index)
    },
    onScrollBottom () {
      if (this.loading) {
        this.page++
        this.loading = false
        this.initData()
      }
    }
  }
}
</script>

<style scoped>
.item_cell{
    min-height: 34px;
    padding: 3px 10px;
    box-sizing: border-box;
    font-size: 10px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
}
  .header{
    box-shadow: 1px 0px 1px gray;
    position: fixed;
    top: 46px;
    background-color: #fff;
    z-index: 2;
  }
  .content{
    padding-top: 34px;
    font-size: 10px;
    
  }
  .striped{
    min-height: 44px;
  }
  .striped:nth-of-type(2n-1){
    background-color: #f0f0f0;
  }
  .tar{
    text-align: right;
  }
</style>