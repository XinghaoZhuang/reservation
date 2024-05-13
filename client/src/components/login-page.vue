<template>
  <div>
    <form @submit.prevent="login">
      <div>
        Phone: <input v-model.trim="form.phone" placeholder="Phone" required/>
      </div>
      <br/>
      <div>
        Password: <input type="password" v-model="form.password" placeholder="Password" required/>
      </div>
      <br/>
      <div>
        <div v-show="errorMsg">
          {{errorMsg}}
        </div>
      </div>
      <div>
        <button type="submit">{{ isRequesting? 'Waiting...' : 'Login' }}</button>
      </div>
      <br/>
      <router-link to="/register">
        <button>Create new accout</button>
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