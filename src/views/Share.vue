<template>
  <div id="share">
    Share
    {{ route }}
    <router-link to="/main">🔥发送阅后即焚🔥</router-link>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'Share',
  data() {
    return {
      route: this.$route.params.key
    }
  }
}
</script>

<style>
</style>
