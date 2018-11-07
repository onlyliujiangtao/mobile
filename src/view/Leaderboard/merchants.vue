<template>
  <div>
      <div class='header'>
        <button-tab>
          <button-tab-item @on-item-click="consoleIndex('money')" selected>交易金额</button-tab-item>
          <button-tab-item @on-item-click="consoleIndex('numberpen')">交易笔数</button-tab-item>
        </button-tab>
      </div>
      <group class="list">
        <cell v-for="(item,index) in items" :key="index" :title="item.merchname" :value="type=='money'?Number(item[type]/100).toFixed(2):item[type]">
          <img slot="icon" width="20" v-if="index<3" style="display:block;margin-right:5px;" :src="'../../../static/images/'+(index+1)+'.png'">
          <span slot="icon" v-if="index>2" class="order">{{index + 1}}</span>
        </cell>
      </group>
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
        type: 'money'
      }
    },
    mounted () {
      this.initData()
    },
    methods: {
      async initData () {
        const params = {
          orderTab: this.type
        }
        let res = await request.todayMerchAmountAndSum(params)
        this.items = res.rows
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
  top:46px;
  left:0;
  height: 44px;
  background-color:#0089bc;
  padding:6px 10% 0 10%;
  box-sizing: border-box;
  z-index: 10000;
}
.list{
  margin-top: 45px;
}
.order{
  display: inline-block;
  min-width: 30px;
}

</style>