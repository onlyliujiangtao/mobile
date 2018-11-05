<template>
  <div class="login">
    <div class="logo">
      <img src="../assets/logo.png" width="150">
    </div>
    <div class="form">
      <group>
        <x-input title="账户" ref="accont" v-model="accont" placeholder="请输入账号"></x-input>
        <x-input title="密码" ref="password" v-model="password" type="password" placeholder="请输入密码"></x-input>
      </group>
    </div>
    <div class="btn">
      <x-button  type="primary" @click.native="login">登录</x-button>
    </div>
  </div>
</template>

<script>
import { Group, XInput, XButton } from 'vux'
import * as request from '@/axios/api'
export default {
  name: 'login',
  components: {
    Group,
    XInput,
    XButton
  },
  data () {
    return {
      accont: '',
      password: ''
    }
  },
  methods: {
    async login () {
      let params = {
        loginCode: this.accont || this.$refs.accont,
        password: this.password || this.$refs.password
      }
      let res = await request.login(params)
      if (res.status) {
        this.$router.push('/main')
      } else {
        this.$toast(res.msg, 'warn')
      }
    }
  }
}
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  }
.logo{
  width: 100%;
  height: 30%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}
.btn{
  width: 80%;
  margin: 20% auto;
}
</style>