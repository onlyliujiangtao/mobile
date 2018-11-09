<template>
  <div class="wrap">
      <div class='header'>
        <button-tab>
          <button-tab-item @on-item-click="consoleIndex('totalrealmoney')" selected>交易金额</button-tab-item>
          <button-tab-item @on-item-click="consoleIndex('totalrealcount')">交易笔数</button-tab-item>
        </button-tab>
      </div>
      <scroller lock-x @on-scroll-bottom="leftBottom" ref="leftBottom" :scroll-bottom-offst="0" class="tbl-left">
        <ul ref="itemli">
          <li class="active" @click="merchat($event,'')">全部</li>
          <li v-for="(item,index) in items" :key="index" @click="merchat($event,item.merch_id)">{{item.merch_name}} </li>
          <load-more tip="loading" v-if="!isLeftBottom"></load-more>
        </ul>
      </scroller>
      <scroller lock-x @on-scroll-bottom="rightBottom" ref="rightBottom" :scroll-bottom-offst="0" class="tbl-right">
        <group class="list">
          <cell class="striped" v-for="(todo,index) in todos" :key="index" :title="todo.term_id" :value="type=='money'?Number(todo[type]/100).toFixed(2):todo[type]/1">
            <img slot="icon" width="20" v-if="index<3" style="display:block;margin-right:5px;" :src="'../../../static/images/'+(index+1)+'.png'">
            <span slot="icon" v-if="index>2" class="order">{{index + 1}}</span>
          </cell>
          <load-more tip="loading" v-if="!isRightBottom"></load-more>
          <divider v-if="isRightBottom" style="padding:50px;">{{bottomText}}</divider>
        </group>
      </scroller>    
  </div>
</template>

<script>
  import { ButtonTab, ButtonTabItem, Group, Cell, Scroller, LoadMore, Divider } from 'vux'
  import * as request from '@/axios/api'
  export default {
    components: {
      ButtonTab,
      ButtonTabItem,
      Cell,
      Group,
      Scroller,
      LoadMore,
      Divider
    },
    data () {
      return {
        items: [],
        todos: [],
        type: 'totalrealmoney',
        merchantid: '',
        leftPage: 1,
        leftLoading: true,
        isLeftBottom: false,
        rightPage: 1,
        rightLoading: true,
        isRightBottom: false,
        bottomText: ''
      }
    },
    mounted () {
      this.initData()
      this.initList()
    },
    methods: {
      leftBottom () {
        if (this.leftLoading) {
          this.leftPage++
          this.initData()
        }
      },
      rightBottom () {
        if (this.rightLoading) {
          this.rightPage++
          this.initList()
        }
      },
      async initData () {
        const params = {
          page: this.leftPage,
          rows: 20
        }
        this.leftPage === 1 && (this.items = [])
        let res = await request.getMerchantGrid(params)
        res.rows.forEach(item => {
          this.items.push(item)
        })
        this.$nextTick(() => {
          this.$refs.leftBottom.reset()
        })
        if (res.rows.length === 0 || res.rows.length < 20) {
          this.isLeftBottom = true
          this.leftLoading = false
        } else {
          this.leftLoading = true
        }
      },
      async initList () {
        const params = {
          merchid: this.merchantid,
          type: this.type,
          rows: 20,
          page: this.rightPage
        }
        this.rightPage === 1 && (this.todos = [])
        let res = await request.todayPipeSumByMerchantId(params)
        res.rows.forEach(item => {
          this.todos.push(item)
        })
        this.$nextTick(() => {
          this.$refs.rightBottom.reset()
        })
        if (res.rows.length === 0 || res.rows.length < 20) {
          this.isRightBottom = true
          this.rightLoading = false
          if (res.total) {
            this.bottomText = '我也是有底线的'
          } else {
            this.bottomText = '暂无数据'
          }
        } else {
          this.rightLoading = true
        }
      },
      async consoleIndex (type) {
        this.type = type
        this.initList()
      },
      merchat (e, id) {
        document.querySelector('.active').setAttribute('class', '')
        e.target.setAttribute('class', 'active')
        this.merchantid = id
        this.initList()
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
  z-index: 10000;
}
.order{
  display: inline-block;
  min-width: 30px;
}
.wrap{
  overflow: hidden;
  height: 100%;
}
.tbl-left{
  width:100px;
  height: calc(100vh - 46px - 44px);
  float: left;
  background-color: #0082bc;
  overflow-x: hidden;
  overflow-y: auto;
  margin-top: 44px;
  box-sizing: border-box;
  padding-bottom: 25px;
}
.tbl-left li{
  padding: 10px 0;
  color: #fff;
  border-bottom: 1px solid grey;
  text-align: center;
  font-size: 16px;
}
.active{
    background-color: #fff;
    color: #000 !important;
}
.tbl-right{
  width: calc(100vw - 100px);
  height: 100%;
  float: left;
  overflow-x: hidden;
  overflow-y: auto;
  margin-top: 44px;
}
.list{
  margin-top: -20px;
}
 .striped:nth-of-type(2n-1){
    background-color: #f0f0f0;
  }
</style>