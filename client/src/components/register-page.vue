<template>
  <div>
    <el-form :model="formRegister" :rules="rules" ref="formRegister">
      <el-form-item label="Phone">
        <el-input v-model.trim="formRegister.phone" placeholder="Phone" required/>
      </el-form-item>
      <el-form-item label="Password" prop="password" >
        <el-input type="password" v-model="formRegister.password" placeholder="Password" required/>
      </el-form-item>
      <el-form-item label="Confirm" prop="confirmPassword">
        <el-input type="password" v-model="formRegister.confirmPassword" placeholder="Confirm" required/>
      </el-form-item>
      <div>
        <div v-show="errorMsg">
          {{errorMsg}}
        </div>
      </div>
      <el-form-item>
        <el-button type="submit" @click="register">{{ isRequesting? 'Waiting...' : 'Register' }}</el-button>
      </el-form-item>
      <br/>
      <router-link to="/login">
        <el-button type="success">Login</el-button>
      </router-link>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('No Paasword'));
      } else {
        if (this.formRegister.confirmPassword !== '') {
          this.$refs.formRegister.validateField('confirmPassword');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please Confirm'));
      } else if (value !== this.formRegister.password) {
        callback(new Error('password not match!'));
      } else {
        callback();
      }
    };
    return {
      isRequesting: false,
      errorMsg: '',
      formRegister: {
        phone: '',
        password: '',
        confirmPassword: '',
      },
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    async register() {
      if (this.isRequesting) {
        return;
      }

      this.errorMsg = '';
      const payload = {
        phone: this.formRegister.phone,
        password: this.formRegister.password,
      };

      try {
        this.isRequesting = true;
        await this.$axios.post('/api/auth/signup', payload);
        this.$router.push('/login');
      } catch (e) {
        const data = e?.response?.data;
        this.errorMsg = data?.message || 'Unknown error. please retry!';
      } finally {
        this.isRequesting = false;
      }
    }
  }
}
</script>
<style>

</style>