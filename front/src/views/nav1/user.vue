<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUser">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->		
	<template>
		<el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="_id" label="编号" width="300" sortable>
			</el-table-column>
			<el-table-column prop="student_id" label="学号" width="100" sortable>
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="100" sortable>
			</el-table-column>
			<el-table-column prop="sex" label="性别" width="100" sortable>
			</el-table-column>
			<el-table-column prop="college" label="学院" width="200" sortable>
			</el-table-column>
			<el-table-column prop="age" label="年龄" min-width="100" sortable>
			</el-table-column>
		</el-table>
	</template>
	</section>
</template>
<script>
	// import { getUserList } from '../../api/api';
	// import NProgress from 'nprogress'
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				loading: false,
				users: [
				]
			}
		},
		methods: {
			//性别显示转换
			// formatSex: function (row, column) {
			// 	return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			// },
			//获取用户列表
			getUser: function () {
				this.loading = true;
				//NProgress.start();
				this.axios.get('/api/students').then((response)=> {
					this.loading = false;
					//NProgress.done();
					let studentArr = []; //重置
					let data = response.data.result;
					data.forEach(function(item) {
						var Data = {
							_id: item._id,
							sex: item.sex,
							name: item.name,
							age: item.age,
							college: item.college,
							student_id: item.student_id
						}
						studentArr.push(Data);
					});
					this.users = studentArr;
				},(error)=>{
					console.log("获取学生失败：" + error);
				});
			}
		},
		mounted() {
			this.getUser();
		}
	};

</script>

<style scoped>

</style>