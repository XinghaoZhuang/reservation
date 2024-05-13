<template>
  <div>
    <form @submit.prevent="createReservation">
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
        <button type="submit">{{ isRequesting? 'Waiting...' : 'Reserve' }}</button>
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
      tableSize: ''
    };
  },
  methods: {
    async createReservation() {
      this.$apollo.mutate({
        mutation: gql`mutation ($expectedArrivalTime: DateTime!, $tableSize: String!){
          createReservation(createReservationInput: { expectedArrivalTime: $expectedArrivalTime, tableSize: $tableSize }) {
            _id
          }
        }`,
        variables: {
          expectedArrivalTime: this.expectedArrivalTime,
          tableSize: this.tableSize,
        }
      });
      this.$router.push('/reservation')
    },
  },
}
</script>