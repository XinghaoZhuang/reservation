<template>
  <div>
    <router-link to="/reservation-create">
      <button>Reserve now!</button>
    </router-link>
    <div v-if="$store.state.loginStatus.isAdmin">
      Filter by status:
        <select v-model="filterStatus">
          <option value="BOOKED">Booked</option>
          <option value="CANCELED">Cancel</option>
          <option value="COMPLETED">Complete</option>
        </select> 
        <button @click="fetchReservations">Filter</button>
    </div>
    <div v-if="reservations.length">
      <table>
        <thead>
          <th>
            Guest Name
          </th>
          <th>
            Expect Arrival Time
          </th>
          <th>
            Table Size
          </th>
          <th>
            Status
          </th>
        </thead>
        <tbody>
          <tr v-for="item in reservations" :key="item._id" @click="$router.push({ name: 'reservation-detail', params: { id: item._id } })">
            <td>
              {{ item.guest ? item.guest.name : 'unknown' }}
            </td>
            <td>
              {{ item.expectedArrivalTime }}
            </td>
            <td>
              {{ item.tableSize }}
            </td>
            <td>
              {{ item.status }}
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <button :disabled="!hasPrev" @click="getPrev">prev</button>
        <button :disabled="!hasNext" @click="getNext">next</button>
      </div>
    </div>
    <div v-if="reservations.length == 0">
      {{ isRequesting ? 'Loading...' : 'No Reservation.' }}
    </div>
  </div>
</template>
<script>
import gql from 'graphql-tag'

const pageSize = 10;

export default {
  data() {
    return {
      currentPage: 0,
      isRequesting: false,
      reservations: [],
      count: 0,
      filterStatus: '',
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.count / pageSize);
    },
    hasNext() {
      return this.currentPage < Math.floor(this.count / pageSize);
    },
    hasPrev() {
      return this.currentPage > 0;
    }
  },
  mounted() {
    this.fetchReservations()
  }, 
  methods: {
    async fetchReservations() {
      const result = await this.$apollo.query({
        query: gql`query Reservation($page: Int!, $pageSize: Int!, $filter: ListReservationFilter!){
          reservations(filter: $filter, pagination: { page: $page, perPage: $pageSize }) {
            _id
            expectedArrivalTime
            tableSize
            status
            guest(populate: true) {
              name
            }
          },
          reservationCount(filter: $filter) {
            count
          }
        }`,
        variables: {
          filter: this.filterStatus ? { status: this.filterStatus } : {},
          page: this.currentPage || 0,
          pageSize,
        },
      });

      this.count = result.data.reservationCount.count;
      this.reservations = result.data.reservations;
    },
    async getNext() {
      if (this.hasNext) {
        this.currentPage += 1;
        await this.fetchReservations()
      }
    },
    async getPrev() {
      if (this.hasPrev) {
        this.currentPage -= 1;
        await this.fetchReservations()
      }
    }
  }
}
</script>
<style>
</style>