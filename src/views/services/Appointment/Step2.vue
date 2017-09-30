<template>
    <section>
        <div class="info">
            <strong><p class="title">{{title}}</p></strong>
            <table>
                <thead>
                    <tr>
                        <th style="width:30%;">
                            <p>医院信息</p>
                        </th>
                        <th style="width:20%;">
                            <p>门诊类型</p>
                        </th>
                        <th style="width:30%;">
                            <p>就诊时间</p>
                        </th>
                        <th style="width:20%;">
                            <p>费用</p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            {{this.$route.params.form.hospital}}<br> {{this.$route.params.form.department}}
                        </td>
                        <td>
                            普通
                        </td>
                        <td>{{this.$route.params.form._date1}}<br>{{this.$route.params.form.date2}}</td>
                        <td class="charge">10.0元<br>(挂号费)</td>
                    </tr>
                </tbody>
            </table>
            <el-alert title="温馨提醒：挂号费由医院自行设定，平台不收取任何额外费用。" type="info" show-icon>
            </el-alert>
        </div>
        <strong><p class="title">预约时间段</p></strong>
            <el-form>
                <el-form-item style="margin-bottom:0">
                    <el-radio-group v-model="time" v-if="this.$route.params.form.date2=='上午6:00~11:30'">
                        <el-radio-button label="08:00~09:00"></el-radio-button>
                        <el-radio-button label="09:00~10:00"></el-radio-button>
                        <el-radio-button label="10:00~11:00"></el-radio-button>
                        <el-radio-button label="11:00~11:30"></el-radio-button>
                    </el-radio-group>
                    <el-radio-group v-model="time" v-else >
                        <el-radio-button label="14:00~15:00"></el-radio-button>
                        <el-radio-button label="15:00~16:30"></el-radio-button>
                        <el-radio-button label="16:00~17:00"></el-radio-button>
                        <el-radio-button label="17:00~17:30"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        <el-col>
            <strong><p class="title">确认用户信息</p></strong>
        </el-col>
        <el-form ref="form" :model="form" label-width="100px" class="form" label-position="right">
            <el-form-item label="姓名">
                <el-col :span="4">
                    <el-input v-model="form.name"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="性别">
                <el-col :span="4">
                    <el-radio class="radio" v-model="form.sex" label="1">男</el-radio>
                    <el-radio class="radio" v-model="form.sex" label="2">女</el-radio>
                </el-col>
            </el-form-item>
            <el-form-item label="年龄">
                <el-col :span="4">
                    <el-input-number v-model="form.age" :step="1" :min="1" :max="200" size="small"></el-input-number> &nbsp;岁
                </el-col>
            </el-form-item>
            <el-form-item label="手机号">
                <el-col :span="4">
                    <el-input v-model="form.phone"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="身份证号">
                <el-col :span="8">
                    <el-input v-model="form.idCard"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="填写疾病信息">
                <el-col :span="8">
                    <el-input v-model="form.disease"></el-input>
                </el-col>
                <el-col :span="8" style="margin-left:10px;">
                    <el-button :plain="true" type="primary" size="small">尚未确诊</el-button>
                </el-col>
            </el-form-item>
        </el-form>
        <el-col :span="24" class="button">
            <el-button :plain="true" type="success" @click="back">上一步</el-button>
            <el-button type="success" @click="next">提交预约</el-button>
        </el-col>
    </section>
</template>

<style lang="scss" scoped>
.title{
    font-size: 18px;
    padding: 10px 0;
}
.info .title{
    padding-top: 0;
}
.form {
    padding: 5px;
    margin-bottom: 10px;
}

.button {
    text-align: center;
}

.info{
 table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    margin-bottom: 3px;
    th {
        font-weight: 400;
        padding: 2px;
        text-align: center;
        line-height: 20px;
        color: #bcbcbc;
        p {
            border-bottom: 3px solid rgba(32, 160, 255, 0.5);
            padding-bottom: 5px;
        }
    }
    td {
        padding: 15px 2px 5px;
        text-align: center;
    }
    .charge {
        color: #FF4949;
    }
}
}
</style>

<script>
export default {
    data() {
        return {
            tableData: {
                hospital: '',
                type: '',
                time: '',
                charge: ''
            },//表格内容
            title: '',
            time:'', //时间段
            form: {
                name: '',
                sex: '1',
                age: '',
                idCard: '',
                phone: '',
                disease:''
            }
        }
    },
    methods: {
        back() {
            this.$router.push({ name: '选择医院', params: { active: 1 } })
        },
        next() {
            this.$router.push({ name: '预约完成', params: { active: 3 } })
        },
    },
    mounted() {
        this.title = this.$route.name;
        // console.log(this.$route.params.form)
    }
}
</script>