<template>
  <div>
    <div>
      Guest Name: <div> {{ reservation.guest ? reservation.guest.name : 'unknown' }}</div><br/><br/>       
      Expect Arrival Time: <div> {{ reservation.expectedArrivalTime }}</div><br/><br/>  
      Table Size: <div> {{ reservation.tableSize }}</div><br/><br/>  
      Status: <div> {{ reservation.status }}</div><br/><br/>
    </div>
    <div v-if="$store.state.loginStatus.isAdmin ? true : reservation.status == 'BOOKED'">
      <el-button @click="$router.push({ name: 'reservation-update', params: { id: reservation._id } })">Update the Reservation</el-button>
    </div>
  </div>
</template>
<script>
import gql from 'graphql-tag'

export default {
  props: ['id'],
  data() {
    return {
      isRequesting: false,
      reservation: null,
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
            guest(populate: true) {
              name
            }
          }
        }`,
        variables: {
          id: this.id
        }
      });
      this.reservation = result.data.reservation;
    }
  },
}
</script>