<template>
  <div>
    <form @submit.prevent="updateReservation">
      <div>
        Expect Arrival Time: <el-date-picker type="datetime" v-model="expectedArrivalTime" ></el-date-picker>
      </div>
      <br/>
      <div>
        Table Size: 
        <div>
          Small (2)<input type="radio" name="table-size" v-model="tableSize" value="SMALL">
        </div>
        <div>
          MEDIUM (3-4)<input type="radio" name="table-size" v-model="tableSize" value="MEDIUM">
        </div>
        <div>
          LARGE (5-8)<input type="radio" name="table-size" v-model="tableSize" value="LARGE">
        </div>
        <div>
          EXTRE LARGE (>9)<input type="radio" name="table-size" v-model="tableSize" value="EXTRE_LARGE ">
        </div>
      </div>
      <div>
        Status:
        <select v-model="status">
          <option value="BOOKED">Booked</option>
          <option value="CANCELED">Cancel</option>
          <option v-if="$store.state.loginStatus.isAdmin" value="COMPLETED">Complete</option>
        </select>
      </div>
      <div>
        <button type="submit">{{ isRequesting? 'Waiting...' : 'Save' }}</button>
      </div>
      <div>
        <button type="cancel" @click="$router.push({ name: 'reservation-detail', params: { id: this.id } })">{{ isRequesting? 'Waiting...' : 'Cancel' }}</button>
      </div>
    </form> 
  </div>
</template>
<script>
import gql from 'graphql-tag'

export default {
  props: ['id'],
  data() {
    return {
      isRequesting: false,
      expectedArrivalTime: '',
      tableSize: '',
      status: ''
    };
  },
  mounted() {
    this.fetchReservation()
  }, 
  methods: {
    async fetchReservation() {
      const result = await this.$apollo.query({
        query: gql`query Reservation($id: String!){
          reservation(id: $id) {
            _id
            expectedArrivalTime
            tableSize
            status
          }
        }`,
        variables: {
          id: this.id
        }
      });
      this.expectedArrivalTime = result.data.reservation.expectedArrivalTime;
      this.tableSize = result.data.reservation.tableSize;
      this.status = result.data.reservation.status;
    },
    async updateReservation() {
      await this.$apollo.mutate({
        mutation: gql`mutation ($expectedArrivalTime: DateTime!, $tableSize: String!, $status: String!, $_id: String!){
          updateReservation(updateReservationInput: { expectedArrivalTime: $expectedArrivalTime, tableSize: $tableSize, status: $status, _id: $_id }) {
            _id
          }
        }`,
        variables: {
          expectedArrivalTime: this.expectedArrivalTime,
          tableSize: this.tableSize,
          status: this.status,
          _id: this.id
        }
      });
      this.$router.push({ name: 'reservation' })
    },
  },
}
</script>