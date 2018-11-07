<template>
  <div>
      <div class='header'>
        <button-tab>
          <button-tab-item @on-item-click="consoleIndex('totalrealmoney')" selected>交易金额</button-tab-item>
          <button-tab-item @on-item-click="consoleIndex('totalrealcount')">交易笔数</button-tab-item>
        </button-tab>
      </div>
      <scroller lock-x @on-scroll-bottom="onScrollBottom" :scroll-bottom-offset="10" ref="scrollerBottom" class="list">
        <div>
          <cell v-for="(item,index) in items" :key="index" :title="item.merch_name" :value="type=='money'?Number(item[type]/100).toFixed(2):item[type]">
            <img slot="icon" width="20" v-if="index<3" style="display:block;margin-right:5px;" :src="'../../../static/images/'+(index+1)+'.png'">
            <span slot="icon" v-if="index>2" class="order">{{index + 1}}</span>
          </cell>
          <load-more v-if="!isBottom" tip="正在加载"></load-more>
          <divider v-if="isBottom">我也是有底线的</divider>
        </div>
      </scroller>
  </div>
</template>

<script>
  import { ButtonTab, ButtonTabItem, Scroller, Cell, LoadMore, Divider } from 'vux'
  import * as request from '@/axios/api'
  export default {
    components: {
      ButtonTab,
      ButtonTabItem,
      Cell,
      Scroller,
      LoadMore,
      Divider
    },
    data () {
      return {
        items: [],
        type: 'totalrealmoney',
        loading: false,
        page: 1,
        isBottom: false
      }
    },
    mounted () {
      this.initData()
    },
    methods: {
      onScrollBottom () {
        if (this.loading) {
          this.page++
          this.loading = false
          this.initData()
        }
      },
      async initData () {
        const params = {
          type: this.type,
          rows: 20,
          page: this.page
        }
        this.page === 1 && (this.items = [])
        let res = await request.todayMerchAmountAndSum(params)
        res.rows.forEach(item => {
          this.items.push(item)
        })
        this.$nextTick(() => {
          this.$refs.scrollerBottom.reset()
        })
        
        if (res.rows.length === 0 || res.rows.length < 20) {
          this.isBottom = true
        } else {
          this.loading = true
        }
      },
      async consoleIndex (type) {
        this.type = type
        this.initData()
      }
    }
  }
</script>

<style scoped>
.header{
  width: 100%;
  position: fixed;
  height: 44px;
  background-color:#0089bc;
  padding:6px 10% 0 10%;
  box-sizing: border-box;
  z-index: 2;
}
.list{
  padding-top: 44px;
  height: calc(100vh - 46px - 44px) !important;
}
.order{
  display: inline-block;
  min-width: 30px;
}

</style>