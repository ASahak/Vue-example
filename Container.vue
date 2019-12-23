<template>
  <div>
    <div class="app-card-header primary-actions">
      <div class="heading-block">
        <h4 class="heading">Live Price Log</h4>
      </div>
      <div class="actions-block group-lg">
        <!--Allow New Alerts-->
        <div class="dropdown-filter med">
          <i-checkbox
            :value="getAllowNewAlert"
            label="Update new alerts"
            color="primary"
            @change="toggleAllowNewAlert($event)"
          />
        </div>
        <!--Category Select-->
        <div class="dropdown-filter">
          <v-autocomplete
            @change="updateByFilters($event, 'category')"
            :value="getSelectedFilters.category"
            :items="getCategories"
            :loading="filters.category.isLoading"
            :search-input.sync="filters.category.search"
            noFilter
            :ripple="false"
            :disabled="getTable.status.loading"
            background-color="rgba(48, 127, 255, 0.1)"
            clearable
            hide-details
            clear-icon
            append-icon="expand_more"
            item-text="name"
            item-value="id"
            label="Category"
            solo
            flat
          >
            <template v-slot:item="{ item }">
              <v-list-tile-content>
                <v-list-tile-title :class="`option-level-${item.level}`" v-text="item.name"></v-list-tile-title>
              </v-list-tile-content>
            </template>
          </v-autocomplete>
        </div>
        <!--Brands Select-->
        <div class="dropdown-filter">
          <v-autocomplete
            @change="updateByFilters($event, 'brand')"
            :value="getSelectedFilters.brand"
            :items="getBrands"
            :loading="filters.brand.isLoading"
            :search-input.sync="filters.brand.search"
            :disabled="getTable.status.loading"
            noFilter
            :ripple="false"
            background-color="rgba(48, 127, 255, 0.1)"
            clearable
            hide-details
            clear-icon
            append-icon="expand_more"
            item-text="name"
            item-value="id"
            label="Brands"
            solo
            flat
          >
            <template v-slot:item="{ item }">
              <v-list-tile-content>
                <v-list-tile-title :class="`option-level-${item.level}`" v-text="item.name"></v-list-tile-title>
              </v-list-tile-content>
            </template>
          </v-autocomplete>
        </div>
        <!--Sellers Select-->
        <div class="dropdown-filter">
          <v-autocomplete
            @change="updateByFilters($event, 'seller')"
            :value="getSelectedFilters.seller"
            :items="getSellers"
            :loading="filters.seller.isLoading"
            :search-input.sync="filters.seller.search"
            :disabled="getTable.status.loading"
            noFilter
            :ripple="false"
            background-color="rgba(48, 127, 255, 0.1)"
            clearable
            hide-details
            clear-icon
            append-icon="expand_more"
            item-text="name"
            item-value="id"
            label="Sellers"
            solo
            flat
          >
          </v-autocomplete>
        </div>
        <!--SKU-->
        <div class="dropdown-filter">
          <v-autocomplete
            @change="updateByFilters($event, 'sku')"
            :value="getSelectedFilters.sku"
            :items="getSkus"
            :loading="filters.sku.isLoading"
            :search-input.sync="filters.sku.search"
            :disabled="getTable.status.loading"
            noFilter
            :ripple="false"
            background-color="rgba(48, 127, 255, 0.1)"
            clearable
            hide-details
            clear-icon
            append-icon="expand_more"
            item-text="name"
            item-value="id"
            label="SKU"
            solo
            flat
          >
          </v-autocomplete>
        </div>
        <!--Price Change Select-->
        <div class="dropdown-filter med">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn
                class="dropdown-btn"
                color="primary"
                flat
                small
                :disabled="getTable.status.loading"
                :ripple="false"
                v-on="on"
              >
                Price Change: {{ priceChangeText(getSelectedFilters.priceChange)}} <v-icon>expand_more</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-tile
                v-for="(item, index) in getPriceChanges"
                :key="index"
                @click="updateByFilters(item, 'priceChange')"
              >
                <v-list-tile-title>{{ priceChangeText(item) }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </div>
        <!--Stock Change Select-->
        <div class="dropdown-filter long">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn
                class="dropdown-btn"
                color="primary"
                flat
                small
                :disabled="getTable.status.loading"
                :ripple="false"
                v-on="on"
              >
                Stock Change: {{ stockChangeText(getSelectedFilters.stockChange) }} <v-icon>expand_more</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-tile
                v-for="(item, index) in getStockChanges"
                :key="index"
                @click="updateByFilters(item, 'stockChange')"
              >
                <v-list-tile-title>{{ stockChangeText(item) }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </div>
        <!--Reset Button-->
        <v-btn
          :disabled="!filters.allowRequest || getTable.status.loading"
          color="primary"
          flat
          small
          :ripple="false"
          @click="resetFilers"
        >
          <v-icon>autorenew</v-icon>
        </v-btn>
        <div class="separator-line"></div>
        <!--Download Excel-->
        <v-tooltip top max-width="235px" :content-class="[`${getThemeColor === '0' ? 'dark-tooltip' : ''} +  i-tooltip`]">
          <template v-slot:activator="{ on }">
            <div v-on="on">
              <v-btn
                class="mx-0"
                color="primary"
                flat
                small
                :ripple="false"
                @click="downloadExcelHandler({
                task: 'loadModule',
                downloadExcel: true,
                payload: {
                  brand_id: getSelectedFilters.brand,
                  category_id: getSelectedFilters.category,
                  seller_id: getSelectedFilters.seller,
                  sku: getSelectedFilters.sku !== 0 ? getSelectedFilters.sku : '',
                  price_change: getSelectedFilters.priceChange,
                  stock_change: getSelectedFilters.stockChange,
                  newest_line: 0,
                  last_update: getAllowNewAlert ? getAllowNewAlert : 0,
                  module_id: 4
                }
              })"
              >
                <v-icon>icon-icon</v-icon>
              </v-btn>
            </div>
          </template>
          <span>Download Excel</span>
        </v-tooltip>
      </div>
    </div>
    <div class="card-body pa-0">
      <Table :tableData="getTable" :tableParams="tableParams" />
    </div>
  </div>
</template>

<script>
import { AppUrl } from '@/assets/js/variables'
import Table from './table'
export default {
  name: 'parentComponent',
  components: {
    Table
  },
  data: () => ({
    filters: {
      category: {
        isLoading: false,
        search: null
      },
      brand: {
        isLoading: false,
        search: null
      },
      seller: {
        isLoading: false,
        search: null
      },
      sku: {
        isLoading: false,
        search: null
      },
      allowRequest: true
    },
    tableParams: {
      rowsPerPageItems: [10, 25, 50, 100],
      pagination: {
        rowsPerPage: 100
      }
    },
    timerSec: 1
  }),
  mounted () {
    if (this.getTable.rows.length <= 0) {
      this.updateByFiltersRequest()
    }
    if (this.getAllowNewAlert) {
      this.initialRequest()
    }
  },
  methods: {
    updateByFiltersRequest () {
      this.$store.dispatch('livePriceLogModule/getSku', {
        brandId: this.getSelectedFilters.brand,
        categoryId: this.getSelectedFilters.category,
        sellerId: this.getSelectedFilters.seller,
        skuId: this.getSelectedFilters.sku,
        priceChange: this.getSelectedFilters.priceChange,
        stockChange: this.getSelectedFilters.stockChange,
        lastUpdate: 0
      })
    },
    updateByFilters (e, key) {
      if (!this.filters.allowRequest) return
      this.$store.commit('livePriceLogModule/SET_selectedFilters', { value: e, key: key })
      this.updateByFiltersRequest()
    },
    resetFilers () {
      this.$store.commit('livePriceLogModule/RESET_selectedFilters')
      this.$store.commit('livePriceLogModule/SET_allowNewAlertFalse')
      this.$store.dispatch('livePriceLogModule/getSku', {
        brandId: this.getSelectedFilters.brand,
        categoryId: this.getSelectedFilters.category,
        sellerId: this.getSelectedFilters.seller,
        skuId: this.getSelectedFilters.sku,
        priceChange: this.getSelectedFilters.priceChange,
        stockChange: this.getSelectedFilters.stockChange,
        lastUpdate: 0
      }).then(() => {
        this.filters.allowRequest = true
      }).catch(() => {
        this.filters.allowRequest = true
      })
      this.resetRequestTimeOut()
    },
    initialRequestDispatch () {
      this.$store.dispatch('livePriceLogModule/getSku', {
        brandId: this.getSelectedFilters.brand,
        categoryId: this.getSelectedFilters.category,
        sellerId: this.getSelectedFilters.seller,
        skuId: this.getSelectedFilters.sku,
        priceChange: this.getSelectedFilters.priceChange,
        stockChange: this.getSelectedFilters.stockChange,
        lastUpdate: this.getTable.lastUpdate
      }).then(() => {
        this.filters.allowRequest = true
      }).catch(() => {
        this.filters.allowRequest = true
      })
    },
    initialRequest () {
      if (this.timerSec) {
        clearTimeout(this.timerSec)
        this.timerSec = null
      }
      this.timerSec = setInterval(() => {
        this.initialRequestDispatch()
      }, 10000)
    },
    resetRequestTimeOut () {
      clearTimeout(this.timerSec)
      if (this.getAllowNewAlert) {
        this.initialRequest()
      }
    },
    toggleAllowNewAlert (e) {
      this.resetRequestTimeOut()
      this.$store.commit('livePriceLogModule/Toggle_allowNewAlert')
      if (e) {
        this.$store.dispatch('livePriceLogModule/getSku', {
          brandId: this.getSelectedFilters.brand,
          categoryId: this.getSelectedFilters.category,
          sellerId: this.getSelectedFilters.seller,
          skuId: this.getSelectedFilters.sku,
          priceChange: this.getSelectedFilters.priceChange,
          stockChange: this.getSelectedFilters.stockChange,
          lastUpdate: this.getTable.lastUpdate
        }).then(() => {
          this.filters.allowRequest = true
        }).catch(() => {
          this.filters.allowRequest = true
        })
      }
    },
    downloadExcelHandler (params) {
      console.log('Params', params)
      let form = document.createElement('form')
      form.setAttribute('method', 'post')
      form.setAttribute('action', AppUrl)
      form.setAttribute('target', 'targetForm')
      for (let i in params) {
        if (params.hasOwnProperty(i)) {
          let input = document.createElement('input')
          input.type = 'hidden'
          input.name = i
          input.value = JSON.stringify(params[i])
          form.appendChild(input)
        }
      }
      document.body.appendChild(form)
      window.open('', 'targetForm')
      form.submit()
      form.remove()
    },
    priceChangeText (key) {
      let name = null
      switch (key) {
        case 0:
          name = 'All'
          break
        case 1:
          name = 'Positive'
          break
        case 2:
          name = 'Negative'
          break
      }
      return name
    },
    stockChangeText (key) {
      let name = null
      switch (key) {
        case 0:
          name = 'All'
          break
        case 1:
          name = 'No change'
          break
        case 2:
          name = 'Only changes'
          break
      }
      return name
    }
  },
  computed: {
    getAllowNewAlert () {
      return this.$store.state.livePriceLogModule.allowNewAlerts
    },
    getCategories () {
      return this.$store.state.livePriceLogModule.categories
    },
    getBrands () {
      return this.$store.state.livePriceLogModule.brands
    },
    getSellers () {
      return this.$store.state.livePriceLogModule.sellers
    },
    getSkus () {
      return this.$store.state.livePriceLogModule.skus
    },
    getPriceChanges () {
      return this.$store.state.livePriceLogModule.priceChanges
    },
    getStockChanges () {
      return this.$store.state.livePriceLogModule.stockChanges
    },
    getSelectedFilters () {
      return this.$store.state.livePriceLogModule.selectedFilters
    },
    getTable () {
      return this.$store.state.livePriceLogModule.table
    },
    getThemeColor () {
      return this.$store.state.auth.userInfo.themeColor
    }
  },
  watch: {
    getAllowNewAlert: function (val) {
      if (val === true) {
        this.initialRequest()
      } else {
        clearTimeout(this.timerSec)
      }
    },
    'filters.category.search': function (val) {
      this.resetRequestTimeOut()
      if (val === '') {
        this.$store.commit('livePriceLogModule/RESET_currentFilter', { key: 'category' })
        this.updateByFiltersRequest()
        return
      }
      if (this.getCategories && this.getCategories.find(el => val === el.name)) return
      let vm = this
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        this.filters.category.isLoading = true
        this.$store.dispatch('livePriceLogModule/getCategories', {
          categoryName: val,
          brandId: vm.getSelectedFilters.brand,
          sellerId: vm.getSelectedFilters.seller,
          skuId: vm.getSelectedFilters.sku,
          priceChange: vm.getSelectedFilters.priceChange,
          stockChange: vm.getSelectedFilters.stockChange,
          lastUpdate: 0
        }).then(() => {
          this.filters.category.isLoading = false
        })
      }, 300)
    },
    'filters.brand.search': function (val) {
      this.resetRequestTimeOut()
      if (val === '') {
        this.$store.commit('livePriceLogModule/RESET_currentFilter', { key: 'brand' })
        this.updateByFiltersRequest()
        return
      }
      if (this.getBrands && this.getBrands.find(el => val === el.name)) return
      let vm = this
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        this.filters.brand.isLoading = true
        this.$store.dispatch('livePriceLogModule/getBrands', {
          brandName: val,
          categoryId: vm.getSelectedFilters.category,
          sellerId: vm.getSelectedFilters.seller,
          skuId: vm.getSelectedFilters.sku,
          priceChange: vm.getSelectedFilters.priceChange,
          stockChange: vm.getSelectedFilters.stockChange,
          lastUpdate: 0
        }).then(() => {
          this.filters.brand.isLoading = false
        })
      }, 300)
    },
    'filters.seller.search': function (val) {
      this.resetRequestTimeOut()
      if (val === '') {
        this.$store.commit('livePriceLogModule/RESET_currentFilter', { key: 'seller' })
        this.updateByFiltersRequest()
        return
      }
      if (this.getSellers && this.getSellers.find(el => val === el.name)) return
      let vm = this
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        this.filters.seller.isLoading = true
        this.$store.dispatch('livePriceLogModule/getSellers', {
          sellerName: val,
          categoryId: vm.getSelectedFilters.category,
          brandId: vm.getSelectedFilters.brand,
          skuId: vm.getSelectedFilters.sku,
          priceChange: vm.getSelectedFilters.priceChange,
          stockChange: vm.getSelectedFilters.stockChange,
          lastUpdate: 0
        }).then(() => {
          this.filters.seller.isLoading = false
        })
      }, 300)
    },
    'filters.sku.search': function (val) {
      this.resetRequestTimeOut()
      if (val === '') {
        this.$store.commit('livePriceLogModule/RESET_currentFilter', { key: 'sku' })
        this.updateByFiltersRequest()
        return
      }
      if (this.getSkus && this.getSkus.find(el => val === el.name)) return
      let vm = this
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        this.filters.sku.isLoading = true
        this.$store.dispatch('livePriceLogModule/getSkus', {
          skuName: val,
          categoryId: vm.getSelectedFilters.category,
          brandId: vm.getSelectedFilters.brand,
          sellerId: vm.getSelectedFilters.seller,
          priceChange: vm.getSelectedFilters.priceChange,
          stockChange: vm.getSelectedFilters.stockChange,
          lastUpdate: 0
        }).then(() => {
          this.filters.sku.isLoading = false
        })
      }, 300)
    }
  },
  destroyed () {
    clearTimeout(this.timerSec)
  }
}
</script>

<style scoped>

</style>
