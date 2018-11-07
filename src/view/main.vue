<template>
  <div class="main">
    <group-title class='title' name="">排行榜</group-title>
    <grid>
      <grid-item link="/merchants" label="服务区排行榜">
        <img slot="icon" src="../assets/logo.png">
      </grid-item>
      <grid-item link="/store" label="门店排行榜">
        <img slot="icon" src="../assets/logo.png">
      </grid-item>
    </grid>
    <group-title class='title' name="">统计查询</group-title>
    <grid>
      <grid-item label="流水查询">
        <img slot="icon" src="../assets/logo.png">
      </grid-item>
      <grid-item label="门店排行榜">
        <img slot="icon" src="../assets/logo.png">
      </grid-item>
      <grid-item label="门店排行榜">
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
.title{
  text-align: center;
  height: 44px;
  line-height: 44px;
  font-size: 16px;
}

</style>