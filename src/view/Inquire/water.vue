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
      <img src="../../../static/images/filter.png" class="filter" @click="btnfc()"/>
      <div v-transfer-dom>
        <popup position="bottom" v-model="show">
          <div class="toolbar-inner">
            <flexbox>
              <flexbox-item class="reset" @click.native="value1=[]">
                <a href="javascript:;">重置搜索</a>
              </flexbox-item>
              <flexbox-item class="choose">
                <span>筛选</span>
              </flexbox-item>
              <flexbox-item class="close">
                 <a href="javascript:;" @click="hiddenShow()">关闭</a>
              </flexbox-item>
            </flexbox>
          </div>
          <group style="margin-top: -20px;">
            <datetime v-model="startTime" format="YYYY-MM-DD HH:mm" :minute-list="['00', '15', '30', '45']" @on-change="change" title="轧账期(起始)"></datetime>
            <datetime v-model="finishTime" format="YYYY-MM-DD HH:mm" :minute-list="['00', '15', '30', '45']" @on-change="change" title="轧账期(截至)"></datetime>
            <selector placeholder="全部服务区" v-model="demo01" title="服务区" name="district" :options="Mlist" @on-change="onChange" direction="rtl"></selector>
            <selector placeholder="全部门店" v-model="demo01" title="门店" name="district" :options="list" @on-change="onChange" direction="rtl"></selector>
          </group>
          <x-button type="default" class="search">搜索</x-button>
        </popup>
     </div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, Cell, Divider, Scroller, LoadMore, Group, Popup, TransferDom,  XButton, Datetime, Selector } from 'vux'
import * as request from '@/axios/api'

let now = new Date()
var y = now.getFullYear()
var m = now.getMonth() + 1
var d = now.getDate()
var time = y+"-"+m+"-"+d

export default {
  directives: {
    TransferDom
  },
  components: {
    Flexbox,
    FlexboxItem,
    Cell,
    Divider,
    LoadMore,
    Scroller,
    Group,
    Popup,
    Datetime,
    TransferDom,
    XButton,
    Selector
  },
  data () {
    return {
      loading: true,
      isBottom: false,
      page: 1,
      num: 30,
      list: [],
      show:false,
      startTime: time + "" + ' 00:00',
      finishTime: time + "" + ' 23:59',
      Mlist: []
    }
  },
  mounted () {
    this.initData(),
    this.merchantList()
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
    async merchantList () {
      let params = {
        page: 1,
        rows: 10000
      }
      let res = await request.getMerchantGrid(params)
      this.Mlist = res.rows.deptname
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
    },
    //点击弹窗
    btnfc () {
      var that = this
      that.show = true
    },
　　//点击关闭
    hiddenShow () {
      var that = this
      that.show = false
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
  .filter{
    position: fixed;
    right: 20px;
    bottom: 50px;
    z-index: 2;
    opacity: 0.5;
  }
  .toolbar-inner{
    height: 44px;
    line-height: 44px;
    padding: 0 10px;
    box-sizing: border-box;
    font-size: 18px;
  }
  .toolbar-inner .choose{
    text-align: center;
  }
  .reset a,.close a{
    color: #0082bc;
  }
  .close{
    text-align: right;
  }
  .search{
    width: 80%;
    height: 45px;
    margin: 10px auto;
    background-color: #0082bc !important;
    color: #fff;
}
</style>