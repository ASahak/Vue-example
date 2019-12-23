import axios from 'axios'
import { AppUrl } from '@/assets/js/variables'

const state = {
  allowNewAlerts: false,
  selectedFilters: {
    category: 0,
    brand: 0,
    seller: 0,
    sku: 0,
    priceChange: 0,
    stockChange: 0
  },
  categories: [],
  brands: [],
  sellers: [],
  skus: [],
  priceChanges: [0, 1, 2],
  stockChanges: [0, 1, 2],
  table: {
    headings: [],
    rows: [],
    lastUpdate: 0,
    status: {
      loading: false,
      noData: false
    }
  }
}

const getters = {

}

const actions = {
  getSku ({ commit }, filter) {
    commit('SET_loading', true)
    return new Promise((resolve, reject) => {
      axios.post(AppUrl, {
        task: 'loadModule',
        payload: {
          brand_id: filter.brandId,
          category_id: filter.categoryId,
          seller_id: filter.sellerId,
          sku: filter.skuId !== 0 ? filter.skuId : '',
          price_change: filter.priceChange,
          stock_change: filter.stockChange,
          newest_line: 0,
          last_update: filter.lastUpdate,
          module_id: 4
        }
      })
        .then(response => {
          if (response.data.payload.series.length > 0 && filter.lastUpdate === 0) {
            commit('SET_sku', response.data.payload)
            commit('SET_loading', false)
            commit('SET_noData', false)
          } else if (filter.lastUpdate !== 0) {
            commit('ADD_sku', response.data.payload)
            commit('SET_loading', false)
            commit('SET_noData', false)
          } else {
            commit('SET_loading', false)
            commit('SET_noData', true)
          }
          resolve()
        })
        .catch(error => {
          commit('SET_loading', false)
          commit('SET_noData', true)
          resolve()
          console.log(error)
        })
    })
  },
  getCategories ({ commit }, filter) {
    return new Promise((resolve, reject) => {
      axios.post(AppUrl, {
        task: 'getCategory',
        payload: {
          category_name: filter.categoryName,
          brand_id: filter.brandId,
          seller_id: filter.sellerId,
          sku: filter.skuId !== 0 ? filter.skuId : '',
          price_change: filter.priceChange,
          stock_change: filter.stockChange,
          newest_line: 0,
          last_update: filter.lastUpdate,
          module_id: 4
        }
      })
        .then(response => {
          if (response.data.payload) {
            commit('SET_categories', response.data.payload.category)
          }
          resolve()
        })
        .catch(error => {
          resolve()
          console.log(error)
        })
    })
  },
  getBrands ({ commit }, filter) {
    return new Promise((resolve, reject) => {
      axios.post(AppUrl, {
        task: 'getBrand',
        payload: {
          brand_name: filter.brandName,
          category_id: filter.categoryId,
          seller_id: filter.sellerId,
          sku: filter.skuId !== 0 ? filter.skuId : '',
          price_change: filter.priceChange,
          stock_change: filter.stockChange,
          newest_line: 0,
          last_update: filter.lastUpdate,
          module_id: 4
        }
      })
        .then(response => {
          if (response.data.payload) {
            commit('SET_brands', response.data.payload.brand)
          }
          resolve()
        })
        .catch(error => {
          resolve()
          console.log(error)
        })
    })
  },
  getSellers ({ commit }, filter) {
    return new Promise((resolve, reject) => {
      axios.post(AppUrl, {
        task: 'getSeller',
        payload: {
          seller_name: filter.sellerName,
          category_id: filter.categoryId,
          brand_id: filter.brandId,
          sku: filter.skuId !== 0 ? filter.skuId : '',
          price_change: filter.priceChange,
          stock_change: filter.stockChange,
          newest_line: 0,
          last_update: filter.lastUpdate,
          module_id: 4
        }
      })
        .then(response => {
          if (response.data.payload) {
            commit('SET_sellers', response.data.payload.seller)
          }
          resolve()
        })
        .catch(error => {
          resolve()
          console.log(error)
        })
    })
  },
  getSkus ({ commit }, filter) {
    return new Promise((resolve, reject) => {
      axios.post(AppUrl, {
        task: 'getSku',
        payload: {
          sku_name: filter.skuName,
          category_id: filter.categoryId,
          brand_id: filter.brandId,
          seller_id: filter.sellerId,
          price_change: filter.priceChange,
          stock_change: filter.stockChange,
          newest_line: 0,
          last_update: filter.lastUpdate,
          module_id: 4
        }
      })
        .then(response => {
          if (response.data.payload) {
            commit('SET_skus', response.data.payload.sku_result)
          }
          resolve()
        })
        .catch(error => {
          resolve()
          console.log(error)
        })
    })
  }
}

const mutations = {
  SET_loading (state, bool) {
    state.table.status.loading = bool
  },
  SET_noData (state, bool) {
    state.table.status.noData = bool
    if (bool === true) {
      state.table.rows = []
    }
  },
  Toggle_allowNewAlert (state) {
    state.allowNewAlerts = !state.allowNewAlerts
  },
  SET_allowNewAlertFalse (state) {
    state.allowNewAlerts = false
  },
  SET_sku (state, data) {
    state.table.headings = data.categories
    state.table.rows = data.series
    state.table.lastUpdate = data.last_update
  },
  ADD_sku (state, newRow) {
    let newItemsLength = newRow.series.length
    let lastItemIndex = state.table.rows.length - 1
    // Updating Last Update
    state.table.lastUpdate = newRow.last_update
    if (newItemsLength > 0) {
      // Pushing new Results to Array
      newRow.series.map(el => (el.isNew = true))
      state.table.rows.unshift(...newRow.series)
      // Removing from end
      state.table.rows.splice(lastItemIndex, newItemsLength)
    }
  },
  SET_categories (state, data) {
    state.categories = data
  },
  SET_brands (state, data) {
    state.brands = data
  },
  SET_sellers (state, data) {
    state.sellers = data
  },
  SET_skus (state, data) {
    state.skus = data
  },
  SET_selectedFilters (state, data) {
    state.selectedFilters[data.key] = data.value
  },
  RESET_selectedFilters (state) {
    let obj = state.selectedFilters
    for (let key in obj) {
      obj[key] = 0
      if (key === 'date') {
        obj[key] = 1
      }
    }
    state.selectedFilters = obj
  },
  RESET_currentFilter (state, data) {
    let obj = state.selectedFilters
    obj[data.key] = 0
    if (data.key === 'data') {
      obj[data.key] = 1
    }
    state.selectedFilters = obj
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
