<template>
  <div>
    <group-title name="">排行榜</group-title>
    <grid>
      <grid-item link="/merchants" label="商户排行榜">
        <img slot="icon" src="../assets/merchant.png">
      </grid-item>
      <grid-item link="/store" label="终端排行榜">
        <img slot="icon" src="../assets/store.png">
      </grid-item>
    </grid>
    <group-title name="">统计查询</group-title>
    <grid>
      <grid-item link="/water" label="今日流水">
        <img slot="icon" src="../assets/water.png">
      </grid-item>
    </grid>
  </div>
</template>

<script>
  import { Grid, GridItem, GroupTitle } from 'vux'
  import * as request from '@/axios/api'
  export default {
    components: {
      Grid, GridItem, GroupTitle
    },
    created () {
      this.$root.eventHub.$off('page.more')
      this.$root.eventHub.$on('page.more', this.loginOut)
    },
    mounted () {
      request.todayPipeSumByMerchantId()
    },
    methods: {
      loginOut () {
        document.cookie = ''
        this.$router.replace('/login')
      }
    }
  }
</script>

<style scoped>

</style>