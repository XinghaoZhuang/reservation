<template>
  <div>
    <form @submit.prevent="register">
      <div>
        Phone: <input v-model.trim="formRegister.phone" placeholder="Phone" required/>
      </div>
      <br/>
      <div>
        Password: <input type="password" v-model="formRegister.password" placeholder="Password" required/>
      </div>
      <br/>
      <div>
        Confirm Password: <input type="password" v-model="formRegister.confirmPassword" placeholder="Confirm Password" required/>
      </div>
      <br/>
      <div>
        <div v-show="errorMsg">
          {{errorMsg}}
        </div>
      </div>
      <div>
        <button type="submit">{{ isRequesting? 'Waiting...' : 'Register' }}</button>
      </div>
      <br/>
      <router-link to="/login">
        <button>Login</button>
      </router-link>
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isRequesting: false,
      errorMsg: '',
      formRegister: {
        phone: '',
        password: '',
        confirmPassword: '',
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