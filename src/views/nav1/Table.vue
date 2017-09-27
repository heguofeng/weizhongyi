<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.phone" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="_id" label="编号" width="300" sortable>
			</el-table-column>
			<el-table-column prop="phone" label="手机号" width="200" sortable>
			</el-table-column>
			<el-table-column prop="password" label="密码" width="200" sortable>
			</el-table-column>		
			<el-table-column label="操作" min-width="150">
				<template scope="scope"><!-- 用来传递id -->
					<el-button size="small" @click="updateInfo(scope.row._id)">编辑</el-button>
					<el-button type="danger" size="small" @click="deleteUser(scope.row._id)">删除</el-button>
					<el-button type="danger" size="small" @click="updatePsw(scope.row._id)">修改密码</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--修改密码界面-->
		<el-dialog title="修改密码" v-model="updatePswFormVisible" :close-on-click-modal="false" size="tiny">
			<el-form :model="updatePswForm" label-width="80px" :rules="updatePswFormRules" ref="updatePswForm">
				<el-form-item label="手机号" prop="phone">
					<el-input v-model="updatePswForm.phone" auto-complete="off" readonly ></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="password">
					<el-input v-model="updatePswForm.password" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="updatePswFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="updatePswSubmit(updatePswForm._id)" :loading="updatePswLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>

	export default {
		data() {
			return {
				filters: {
					phone: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},

				updatePswFormVisible: false,//修改密码界面是否显示
				updatePswLoading: false,
				updatePswFormRules: {
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					]
				},
				updatePswForm:{
					password:''
				}
			}
		},
		methods: {
			//获取用户列表
			getUsers: function() {
				this.listLoading = true;
				this.axios.get('/api/users').then((response)=> {
					this.listLoading = false;
					let usersArr = []; //重置
					let data = response.data.result;
					data.forEach(function(item) {
						var Data = {
							_id: item._id,
							phone:item.phone,
							password:item.password
						}
						usersArr.push(Data);
					});
					this.users = usersArr;
				},(error)=>{
					console.log("获取信息失败：" + error);
				});
			},
			getToken: function() {
				this.axios.get('/api/token').then((response) => {
					this.token = response.data.result;
				}, (error) => {
					console.log("获取token失败：" + error);
				});
			},	
			//删除
			deleteUser: function (id) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.axios.delete('/api/user/' + this.token + '/' + id).then((response)=> {				
						this.$message.success( response.data.result);
					}).catch(function(err) {
						alert(err);
					})
				}).catch(() => {

				});
			},
			//显示编辑界面
			updateInfo: function (id) {
				this.editFormVisible = true;

			},
			//显示修改密码界面
			updatePsw:function(id){
				this.updatePswFormVisible = true;
				this.axios.get('/api/user/' + id).then((response) =>{
					var Data = response.data.result;
					var _Data = {
						_id: Data._id,
						phone:Data.phone,
					};
					this.updatePswForm = _Data;
				}).catch(function(err) {
					alert(err);
				});
			},

			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},

			//修改密码
			updatePswSubmit:function(id){
				//将token放进updatePswForm里一起传过去
				this.updatePswLoading=true;
				this.updatePswFormVisible=true;
				this.updatePswForm.token = this.token;
				this.axios.put('/api/user-psw/' + id, this.updatePswForm).then((response)=> {
					this.updatePswFormVisible=false;
					this.updatePswLoading=false;
				}).catch(function(err) {
					alert(err);
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//订阅消息--学生数据变化
			websocket: function() {
				this.axios.get('/api/token').then((response)=> {
					this.token = response.data.result;
					var ws = new WebSocket(`ws://${location.hostname}:3000`);
					ws.onopen = ()=>{
						console.log("打开了ws")
						ws.send(this.token);
					};
					ws.onmessage = ()=> {
						console.log('收到了消息')
						this.getToken();
						this.getUsers();
					};
				},(error)=> {
					console.log("出错：" + error);
				});
			},
		},
		mounted() {
			this.getToken();
			this.getUsers();
			this.websocket();
		}
	}

</script>

<style scoped>

</style>