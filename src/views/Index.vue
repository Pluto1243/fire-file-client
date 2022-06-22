<template>
  <div id="share" class="main">
    <el-button @click="toMain" id="indexButton">🔥 发送阅后即焚</el-button><br/>
    <el-input placeholder="请输入key提取" v-model="key" class="input-with-select" style="margin-top:150px; width: 60%;">
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
      if (!this.key) {
        this.$message.warning('请输入key！')
        return
      }
      this.$router.push('/s/' + this.key)
    }
  }
}
</script>

<style>
  .main{
    width: 100%;
    margin: 120px auto;
    text-align: center;
  }
  #indexButton{
    background-image: linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);
    margin-top: 150px;
    height: 75px;
    width: 250px;
    font-size: 24px;
    color: white;
    border-radius: 5px;
  }
  #indexButton:hover{
    color: #49ba0b;
  }
</style>
