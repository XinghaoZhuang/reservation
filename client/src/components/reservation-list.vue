<template>
  <div>
    <router-link to="/reservation-create">
      <el-button>Reserve now!</el-button>
    </router-link>
    <div v-if="$store.state.loginStatus.isAdmin">
      Filter by status:
        <select v-model="filterStatus">
          <option value="BOOKED">Booked</option>
          <option value="CANCELED">Cancel</option>
          <option value="COMPLETED">Complete</option>
        </select> 
        <el-button @click="fetchReservations">Filter</el-button>
    </div>
    <div v-if="reservations.length">
      <el-table :data="reservations">
        <el-table-column
          prop="guest.name"
          label="Guest Name"
          width="180">
        </el-table-column>
        <el-table-column
          prop="expectedArrivalTime"
          label="Expect Arrival Time"
          width="280">
        </el-table-column>
        <el-table-column
          prop="tableSize"
          label="Table Size"
          width="100">
        </el-table-column>
        <el-table-column
          prop="status"
          label="Status"
          width="100">
        </el-table-column>
        <el-table-column
          label="Operations"
          width="200">
          <template slot-scope="scope">
            <el-button @click.native.prevent="$router.push({ name: 'reservation-detail', params: { id: scope.row._id } })">Detail</el-button>
            <el-button @click.native.prevent="$router.push({ name: 'reservation-update', params: { id: scope.row._id } })">Edit</el-button>
          </template>
        </el-table-column>
        
      </el-table>
      <div>
        <el-button :disabled="!hasPrev" @click="getPrev">Prev</el-button>
        <el-button :disabled="!hasNext" @click="getNext">Next</el-button>
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