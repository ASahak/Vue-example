<template>
  <div>
    <v-progress-circular
      v-if="tableData.status.loading && tableData.rows.length <= 0"
      :indeterminate="true"
      :size="75"
      height="3"
      color="primary"
      class="progress-circular"  />
    <v-data-table
      v-if="!tableData.status.noData"
      :items="tableData.rows"
      :rows-per-page-items="tableParams.rowsPerPageItems"
      :pagination.sync="tableParams.pagination"
      :loading="tableData.status.loading && tableData.rows.length > 0"
      no-data-text=""
      :hide-actions="tableData.status.loading && tableData.rows.length < 0"
      :hide-headers="tableData.status.loading && tableData.rows.length < 0"
      class="i-table live-log-table"
    >
      <template slot="headers">
        <tr>
          <th
            class="text-xs-left"
            v-for="(header, i) in tableData.headings"
            :key="i"
          >
            {{ header }}
          </th>
        </tr>
      </template>
      <template v-slot:items="props">
        <tr :class="{'new-row' : props.item.hasOwnProperty('isNew')}">
          <td
            v-for="index in props.item.data.length"
            :key="index"
            :class="{'positive-td' : index === 6 && props.item.data[index - 1] > 0, 'negative-td' : index === 6 && props.item.data[index - 1] < 0}">
            {{ props.item.data[index - 1] }}
          </td>
        </tr>
      </template>
    </v-data-table>
    <i-no-data v-else heading="Oops!"/>
  </div>
</template>

<script>
export default {
  name: 'livePriceLogTable',
  props: {
    tableData: {
      type: [Object, Array],
      default: null
    },
    tableParams: {
      type: [Object, Array],
      default: null
    }
  }
}
</script>

<style scoped>

</style>
