<template>
  <div class="main">
    <group-title name="">排行榜</group-title>
    <grid>
      <grid-item link="/merchants" label="商户排行榜">
        <img slot="icon" src="../assets/logo.png">
      </grid-item>
      <grid-item link="/store" label="门店排行榜">
        <img slot="icon" src="../assets/logo.png">
      </grid-item>
    </grid>
    <group-title name="">统计查询</group-title>
    <grid>
      <grid-item link="/water" label="今日流水">
        <img slot="icon" src="../assets/logo.png">
      </grid-item>
    </grid>
  </div>
</template>

<script>
  import { Grid, GridItem, GroupTitle } from 'vux'
  export default {
    components: {
      Grid, GridItem, GroupTitle
    },
    created () {
      this.$root.eventHub.$off('page.more')
      this.$root.eventHub.$on('page.more', this.loginOut)
    },
    methods: {
      loginOut () {
        this.$router.replace('/')
      }
    }
  }
</script>

<style scoped>

</style>