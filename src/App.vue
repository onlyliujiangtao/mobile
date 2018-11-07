<template>
  <div id="app">
    <div v-transfer-dom>
      <loading v-model="isLoading" :text="loadingText"></loading>
    </div>
    <view-box ref="viewBox" v-if="isHeader" body-padding-top="46px">
      <x-header slot="header" class="app-header" :left-options="leftOptions" :right-options="rightOptions" :title="title" @on-click-more="onClickMore" :transition="headerTransition">
          <a slot="right" v-show="rightOptions.showAdd" @click="onClickMore" v-text="moreText"></a>
      </x-header>
      <transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')" v-on:before-enter="beforeEnter" v-on:after-enter="afterEnter">
        <router-view class="router-view"></router-view>
      </transition>
    </view-box>
    <view-box ref="viewBox" v-else>
      <transition :name="'three-pop-' + (direction === 'forward' ? 'in' : 'out')" v-on:before-enter="beforeEnter" v-on:after-enter="afterEnter">
        <router-view class="router-view-three"></router-view>
      </transition>
    </view-box>
  </div>
</template>

<script>
import { Loading, ViewBox, TransferDom, XHeader } from 'vux'
import { mapGetters } from 'vuex'
export default {
  name: 'app',
  directives: {
    TransferDom
  },
  components: {
    Loading,
    ViewBox,
    XHeader
  },
  computed: {
    ...mapGetters(['isLoading', 'loadingText', 'direction']),
    title () {
      return this.$route.name || ''
    },
    moreText () {
      return this.$route.meta.headerLeftText || '添加'
    },
    leftOptions () {
      return {
        showBack: this.$route.path !== '/main'
      }
    },
    rightOptions () {
      return {
        showMore: false,
        showAdd:
          this.$route.path === '/main'
      }
    },
    headerTransition () {
      return this.direction === 'forward'
        ? 'vux-header-fade-in-right'
        : 'vux-header-fade-in-left'
    },
    isHeader () {
      return this.$route.path !== '/'
    }
  },
  methods: {
    afterEnter (el) {
      this.$root.eventHub.$emit('page.afterEnter', '1')
      if (this.$root.currentScroll.length > 0) {
        this.$root.currentScroll.forEach(scroll => {
          scroll.refresh()
        })
      }
    },
    beforeEnter (el) {
      this.$root.currentScroll = []
    },
    onClickMore () {
      this.$root.eventHub.$emit('page.more')
    }
  }
}
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";

body {
  background-color: #fbf9fe;
}
#app{
  width: 100%;
  height: 100vh;
}

.app-header {
  width: 100%;
  position: fixed !important;
  left: 0;
  top: 0;
  z-index: 100;
}

.router-view {
  width: 100%;
  // top: 46px;
}

.router-view-three {
  width: 100%;
  top: 0px;
}

.vux-pop-out-enter-active,
.vux-pop-out-leave-active,
.vux-pop-in-enter-active,
.vux-pop-in-leave-active {
  will-change: transform;
  transition: all 500ms;
  height: 100%;
  top: 46px;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}

.vux-pop-out-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.vux-pop-out-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.vux-pop-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.vux-pop-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
} //无头部
.three-pop-out-enter-active,
.three-pop-out-leave-active,
.three-pop-in-enter-active,
.three-pop-in-leave-active {
  will-change: transform;
  transition: all 500ms;
  height: 100%;
  top:0px;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}

.three-pop-out-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.three-pop-out-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.three-pop-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.three-pop-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.weui-tab__panel{
  padding-bottom: 0 !important;
}
</style>
