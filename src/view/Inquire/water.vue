<template>
  <div class="water">
      <flexbox class="header item_cell">
        <flexbox-item>终端</flexbox-item>
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
          <flexbox class="item_cell striped" v-for="(item,index) in list" :key="index" @click.native="lookDetail(item.host_date+item.host_time)">
            <flexbox-item>{{item.term_id}}</flexbox-item>
            <flexbox-item>{{$root.dateFormat('yyyy-MM-dd hh:mm:ss',item.host_date+item.host_time)}}</flexbox-item>
            <flexbox-item>
              <flexbox>
                <flexbox-item class="tar">{{(item.trans_amt/1).toFixed(2)}}</flexbox-item>
                <flexbox-item class="tar">{{payType2Text(item.pay_type)}}</flexbox-item>
              </flexbox>
            </flexbox-item>
          </flexbox>
          <load-more v-if="!isBottom" tip="正在加载"></load-more>
          <divider v-if="isBottom">{{bottomText}}</divider>
        </div>
      </scroller>
      <img src="../../../static/images/filter.png" class="filter" @click="btnfc()"/>
      <div v-transfer-dom>
        <popup position="bottom" v-model="show">
          <popup-header
            left-text="重置搜索"
            right-text="关闭"
            title="筛选"
            @on-click-left="resetSearch"
            @on-click-right="hiddenShow"></popup-header>
          <group style="margin-top: -20px;">
            <datetime placeholder="请选择开始时间" v-model="searchParams.query_date" title="起始时间"></datetime>
            <datetime placeholder="请选择结束时间" v-model="searchParams.query_e_date" title="结束时间"></datetime>
            <selector placeholder="请选择商户"  v-model="searchParams.merch_id" @on-change="merchChange" title="商户" :options="Mlist" direction="rtl"></selector>
            <selector placeholder="请选择终端" v-model="searchParams.term_id" title="终端" :options="Tlist" direction="rtl"></selector>
          </group>
          <x-button type="default" class="search" @click.native="submit">搜索</x-button>
        </popup>
     </div>
    <div v-transfer-dom>
      <popup v-model="detailShow" height="100%" class="detail">
        <popup-header style="background-color:#0082bc;">
          <span slot="title" style="color:#fff;">流水详情</span>
        </popup-header>
        <form-preview header-label="交易金额" :header-value="'￥'+trans_amt" :body-items="detail"></form-preview>
        <x-button type="default" class="search" style="margin:50px auto;" @click.native="detailShow = false">关闭</x-button>
      </popup>
    </div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, Cell, Divider, Scroller, LoadMore, Group, Popup, PopupHeader, TransferDom, XButton, Datetime, Selector, FormPreview } from 'vux'
import * as request from '@/axios/api'

// let now = new Date()
// var y = now.getFullYear()
// var m = (now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
// var d = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
// var time = y + '-' + m + '-' + d

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
    PopupHeader,
    Selector,
    FormPreview
  },
  data () {
    return {
      loading: true,
      isBottom: false,
      bottomText: '',
      page: 1,
      num: 30,
      list: [],
      water: {},
      show: false,
      Mlist: [],
      Tlist: [],
      detail: [],
      detailShow: false,
      searchParams: {
        query_date: '',
        query_e_date: '',
        term_id: '',
        merch_id: ''
      },
      trans_amt: ''
    }
  },
  mounted () {
    this.initData()
    this.merchantList()
  },
  methods: {
    payType2Text (code) {
      switch (code) {
        case '0': return '现金'
        case '1': return 'ETC'
        default: return '其他支付'
      }
    },
    tradeType2Text (code) {
      switch (code) {
        case '0': return '洗车机'
        case '1': return '停车场'
        default: return '其他'
      }
    },
    async initData () {
      let params = {
        page: this.page,
        rows: 20,
        ...this.searchParams
      }
      if (this.page === 1) {
        this.list = []
        this.water = {}
      }
      let res = await request.getTranlineGrid(params)
      console.log(res)
      res.rows.forEach((item, index) => {
        this.list.push(item)
        this.water[item.host_date + item.host_time] = item
      })
      this.$nextTick(() => {
        this.$refs.scrollerBottom.reset()
      })
      if (res.rows.length === 0 || res.rows.length < 20) {
        this.isBottom = true
        this.loading = false
        if (res.total) {
          this.bottomText = '我也是有底线的'
        } else {
          this.bottomText = '暂无数据'
        }
      } else {
        this.loading = true
      }
    },
    async merchantList () {
      let params = {
        page: 1,
        rows: 1000000
      }
      this.Mlist = [{key: '', value: '全部'}]
      let res = await request.getMerchantGrid(params)
      res.rows.forEach(item => {
        this.Mlist.push({key: item.merch_id, value: item.merch_name})
      })
    },
    merchChange () {
      this.storeList(this.searchParams.merch_id)
    },
    async storeList (id) {
      let params = {
        page: 1,
        rows: 1000000,
        merchid: id
      }
      this.Tlist = [{key: '', value: '全部'}]
      let res = await request.getTerminalGrid(params)
      res.rows.forEach(item => {
        this.Tlist.push({key: item.termid, value: item.termid})
      })
    },
    submit () {
      this.initData()
      this.hiddenShow()
    },
    lookDetail (index) {
      const detail = this.water[index]
      this.trans_amt = detail.trans_amt
      this.detail = []
      this.detail.push({label: '交易状态', value: detail.return_code})
      this.detail.push({label: '交易类型', value: this.tradeType2Text(detail.trade_type)})
      this.detail.push({label: '支付类型', value: this.payType2Text(detail.pay_type)})
      this.detail.push({label: '终端号', value: detail.term_id})
      this.detail.push({label: '卡类型', value: detail.card_type})
      this.detail.push({label: '车牌号', value: detail.license})
      this.detail.push({label: '交易前余额', value: detail.pre_balance})
      this.detail.push({label: '交易后余额', value: detail.post_balance})
      this.detail.push({label: '洗车机位置编码', value: detail.sit_no})
      this.detail.push({label: '卡交易流水', value: detail.card_detail})
      this.detail.push({label: '终端交易流水', value: detail.term_detail})
      this.detail.push({label: '洗车机安装地址', value: detail.install_addr})
      this.detail.push({label: '交易时间', value: this.$root.dateFormat('yyyy-MM-dd hh:mm:ss', detail.host_date + detail.host_time)})
      this.detailShow = true
    },
    onScrollBottom () {
      if (this.loading) {
        this.page++
        this.initData()
      }
    },
    btnfc () {
      this.show = true
    },
    hiddenShow () {
      this.show = false
    },
    resetSearch () {
      this.searchParams = {
        query_date: '',
        query_e_date: '',
        term_id: '',
        merch_id: ''
      }
      this.initData()
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
  .search{
    width: 80%;
    height: 45px;
    margin: 10px auto;
    background-color: #0082bc !important;
    color: #fff;
  }
  .center{
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }
  .detail{
    background-color: #fff;
  }
</style>