
<template>
  <div id="app">
	<router-view></router-view>
  </div>
</template>

<script>
export default {
	name: 'app',
	created(){
		try{
			document.body.removeChild(document.getElementById('appLoading'))
			setTimeout(function() {
					document.bgColor='#e2e2e2'
      		document.getElementById('app').style.display = 'block';
			}, 500);

		}catch(e){

		}
	}
}
</script>

<style lang="scss">
body,p{
  margin: 0;
  padding: 0;
}
table,
td,
tr,
th {
    margin: 0;
    padding: 0;
    font-size: 100%;
    vertical-align: baseline;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	font-size: 14px;
}
.el-submenu [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.el-menu-item [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.toolbar {
	background: #f2f2f2;
	padding: 10px;
	/* border:1px solid #dfe6ec; */
	margin: 10px 0px;
	.el-form-item {
		margin-bottom: 10px;
	}
}

.clearfix:after{content:"";*display:block;*clear:both;}
.clearfix{zoom:1;}
</style>
