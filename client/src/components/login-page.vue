<template>
  <div>
    <el-form ref="form" :model="form">
      <el-form-item label="Phone">
        <el-input v-model.trim="form.phone" placeholder="Phone" required/>
      </el-form-item>
      <el-form-item label="Password">
        <el-input type="password" v-model="form.password" placeholder="Password" required/>
      </el-form-item>
      <div>
        <div v-show="errorMsg">
          {{errorMsg}}
        </div>
      </div>
      <el-form-item>
        <el-button type="submit" @click="login">{{ isRequesting? 'Waiting...' : 'Login' }}</el-button>
      </el-form-item>
      
      <br/>
      <router-link to="/register">
        <el-button type="success">Create new accout</el-button>
      </router-link>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isRequesting: false,
      errorMsg: '',
      form: {
        phone: '',
        password: '',
      }
    }
  },
  methods: {
    async login() {
      if (this.isRequesting) {
        return;
      }

      this.errorMsg = '';
      const payload = {
        phone: this.form.phone,
        password: this.form.password,
      };

      try {
        this.isRequesting = true;
        await this.$axios.post('/api/auth/login', payload);
        await this.$store.dispatch('fetchLoginStatus');
        this.$router.push('/reservation');
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