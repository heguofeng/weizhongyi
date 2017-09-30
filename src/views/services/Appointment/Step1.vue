<template>
    <section>
        <el-col>
            <h2 v-text="title"></h2>
        </el-col>
        <el-form ref="form" :model="form" label-width="100px" class="form" label-position="right">
            <el-form-item label="选择医院">
                <el-select v-model="form.hospital" placeholder="选择医院" filterable>
                    <el-option label="医院一" value="医院一"></el-option>
                    <el-option label="医院二" value="医院二"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择科室">
                <el-select v-model="form.department" placeholder="选择科室" filterable>
                    <el-option label="科室一" value="科室一"></el-option>
                    <el-option label="科室二" value="科室二"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="挂号时间">
                <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" :picker-options="pickerOptions0" style="width:215px" format="yyyy年MM月dd日" @change="log">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="选择时间段">
                <el-radio-group v-model="form.date2">
                    <el-radio-button label="上午6:00~11:30"></el-radio-button>
                    <el-radio-button label="下午12:00~16:30"></el-radio-button>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <el-col :span="24" class="button">
            <el-button type="success" @click="next">下一步</el-button>
        </el-col>
    </section>
</template>

<style scoped>
.form {
    width: 500px;
    padding: 5px;
    margin-bottom: 10px;
}
.button{
  text-align: center;
}
</style>

<script>
export default {
    data() {
        return {
            title:'',
            form: {
                hospital: '',
                department: '',
                date1: '',//只用于显示
                _date1:'',//正真用于传递
                date2: "上午6:00~11:30"
            },
            pickerOptions0: {
                disabledDate(time) {
                    // 未来7天
                    return time.getTime() < Date.now() - 8.64e7 || time.getTime() > Date.now() - 8.64e7 + 7 * 24 * 3600 * 1000
                },
                
            },
        }
    },
    methods:{
        next(){
            this.$router.push({name:'确认预约信息',params:{active:2,form:this.form}})
        },
        log(val){
            this.form._date1=val;  //修改格式
        }
    },
    mounted(){
        this.title=this.$route.name;
    },

}
    
</script>