<template>
  <div>
    <!-- <img src="@/assets/logo.png"> -->
    <div class="tabs">
      <ul class="list">
          <router-link :to="{name:'GetInfo'}" tag="li" class="login">
            <div>获取</div>
          </router-link>
          <router-link :to="{name:'PutInfo'}" tag="li">
            <div>PutInfo</div>
          </router-link>
      </ul>
    </div>
        <router-view></router-view>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>

