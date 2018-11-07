<template>
  <div class="wrap">
      <div class='header'>
        <button-tab>
          <button-tab-item @on-item-click="consoleIndex('money')" selected>交易金额</button-tab-item>
          <button-tab-item @on-item-click="consoleIndex('numberpen')">交易笔数</button-tab-item>
        </button-tab>
      </div>
      <div class="tbl-left">
        <ul>
          <li class="active" @click.native="merchat">全部</li>
          <li v-for="(item,index) in items" :key="index" @click="merchat(item.merch_id)">{{item.deptname}} </li>
        </ul>
      </div>
      <div class="tbl-right">
        <group class="list">
          <cell v-for="(todo,index) in todos" :key="index" :title="todo.termName" :value="type=='money'?Number(todo[type]/100).toFixed(2):todo[type]">
            <img slot="icon" width="20" v-if="index<3" style="display:block;margin-right:5px;" :src="'../../../static/images/'+(index+1)+'.png'">
            <span slot="icon" v-if="index>2" class="order">{{index + 1}}</span>
          </cell>
        </group>
      </div>    
  </div>
</template>

<script>
  import { ButtonTab, ButtonTabItem, Group, Cell } from 'vux'
  import * as request from '@/axios/api'
  export default {
    components: {
      ButtonTab,
      ButtonTabItem,
      Cell,
      Group
    },
    data () {
      return {
        items: [],
        todos: [],
        type: 'money',
        merchantid: ''
      }
    },
    mounted () {
      this.initData(),
      this.initList()
    },
    methods: {
      async initData () {
        const params = {
          page: 1,
          rows: 20
        }
        let res = await request.getMerchantGrid(params)
        this.items = res.rows 
      },
      async initList () {
        const params = {
          merchantid: this.merchantid,
          orderTab: this.type
        }
        let res = await request.todayPipeSumByMerchantId(params)
        this.todos = res.rows
      },
      async consoleIndex (type) {
        this.type = type
        this.initList()
      },
      merchat(id){
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
  top:46px;
  left:0;
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
  height: 100%;
  float: left;
  background-color: #0082bc;
  overflow-x: hidden;
  overflow-y: auto;
  margin-top: 46px;
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
  margin-top: 46px;
}
.list{
  margin-top: -20px;
}

</style>