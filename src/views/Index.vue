<template>
  <div id="share" class="main">
    <el-button @click="toMain" class="indexButton">🔥 发送阅后即焚</el-button><br/>
    <el-input placeholder="请输入提取链接" v-model="key" class="input-with-select" style="margin-top:150px; width: 50%">
      <el-button slot="append" icon="el-icon-search" @click="toShare"></el-button>
    </el-input>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      key: null
    }
  },
  methods: {
    toMain() {
      this.$router.push('/main')
    },
    toShare() {
      this.$router.push('/s/' + this.key)
    }
  }
}
</script>

<style>
  .main{
    width: 100%;
    text-align: center;
  }
  .indexButton{
    background-image: linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);
    margin-top: 150px;
    height: 75px;
    width: 250px;
    font-size: 24px;
    color: white;
    border-radius: 5px;
  }
  .indexButton:hover{
    color: #49ba0b;
  }
</style>
