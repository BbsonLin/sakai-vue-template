<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import ProductService from '@/service/ProductService'
import { useLayout } from '@/layout/composables/layout'
import { ProductSmall, BestProduct } from '#/product'

const { isDarkTheme } = useLayout()

const products = ref<null | ProductSmall[]>(null)
const bestProducts = ref<BestProduct[]>([])
const lineData = reactive({
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      backgroundColor: '#2f4860',
      borderColor: '#2f4860',
      tension: 0.4
    },
    {
      label: 'Second Dataset',
      data: [28, 48, 40, 19, 86, 27, 90],
      fill: false,
      backgroundColor: '#00bb7e',
      borderColor: '#00bb7e',
      tension: 0.4
    }
  ]
})
const lineOptions = ref({})
const searchDate = ref(null)
const productService = new ProductService()

onMounted(() => {
  productService.getProductsSmall().then((data: ProductSmall[]) => (products.value = data))
  productService.getBestProducts().then((data: BestProduct[]) => (bestProducts.value = data))
})

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}
const applyLightTheme = () => {
  lineOptions.value = {
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      },
      y: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      }
    }
  }
}

const applyDarkTheme = () => {
  lineOptions.value = {
    plugins: {
      legend: {
        labels: {
          color: '#ebedef'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#ebedef'
        },
        grid: {
          color: 'rgba(160, 167, 181, .3)'
        }
      },
      y: {
        ticks: {
          color: '#ebedef'
        },
        grid: {
          color: 'rgba(160, 167, 181, .3)'
        }
      }
    }
  }
}

watch(
  isDarkTheme,
  (val) => {
    if (val) {
      applyDarkTheme()
    } else {
      applyLightTheme()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="flex">
    <div class="w-1/1 md:w-1/2 lg:w-1/4 p-2">
      <Card>
        <template #subtitle>Orders</template>
        <template #content>
          <p class="mb-3 text-xl font-semibold">152</p>
          <p><span class="text-green-500 font-medium">24</span> new since last visit</p>
        </template>
      </Card>
    </div>
    <div class="w-1/1 md:w-1/2 lg:w-1/4 p-2">
      <Card>
        <template #subtitle>Revenue</template>
        <template #content>
          <p class="mb-3 text-xl font-semibold">$2.100</p>
          <p><span class="text-green-500 font-medium">%52+</span> since last week</p>
        </template>
      </Card>
    </div>
    <div class="w-1/1 md:w-1/2 lg:w-1/4 p-2">
      <Card>
        <template #subtitle>Customers</template>
        <template #content>
          <p class="mb-3 text-xl font-semibold">28441</p>
          <p><span class="text-green-500 font-medium">520</span> newly registered</p>
        </template>
      </Card>
    </div>
    <div class="w-1/1 md:w-1/2 lg:w-1/4 p-2">
      <Card>
        <template #subtitle>Comments</template>
        <template #content>
          <p class="mb-3 text-xl font-semibold">152 Unread</p>
          <p><span class="text-green-500 font-medium">85</span> responded</p>
        </template>
      </Card>
    </div>
  </div>

  <div class="flex">
    <div class="w-1/1 md:w-1/2 p-2">
      <Card>
        <template #title>Recent Sales</template>
        <template #content>
          <DataTable :value="products" :rows="5" :paginator="true" responsiveLayout="scroll">
            <Column style="width: 15%">
              <template #header> Image </template>
              <template #body="slotProps">
                <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" :alt="slotProps.data.image"
                  width="50" class="shadow-2" />
              </template>
            </Column>
            <Column field="name" header="Name" :sortable="true" style="width: 35%"></Column>
            <Column field="price" header="Price" :sortable="true" style="width: 35%">
              <template #body="slotProps">
                {{ formatCurrency(slotProps.data.price) }}
              </template>
            </Column>
            <Column style="width: 15%">
              <template #header> View </template>
              <template #body>
                <Button icon="pi pi-search" type="button" class="p-button-text"></Button>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
    <div class="w-1/1 md:w-1/2 p-2">
      <Card>
        <template #title>Best 5 Products</template>
        <template #content>
          <DataView :value="bestProducts">
            <template #list="slotProps">
              <div class="grid grid-nogutter">
                <div v-for="(item, index) in slotProps.items" :key="index">
                  <div class="flex flex-column sm:flex-row sm:align-items-center p-3"
                    :class="{ 'border-top-1 surface-border': index !== 0 }">
                    <div class="md:w-10rem relative">
                      <img :src="`https://primefaces.org/cdn/primevue/images/product/${item.image}`" :alt="item.name"
                  width="70" class="shadow-2 block xl:block border-round mx-auto" />
                    </div>
                    <div class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-4">
                      <div class="flex flex-row md:flex-column justify-content-between align-items-start gap-2">
                        <div>
                          <div class="font-medium mt-2">{{ item.name }}</div>
                          <Rating v-model="item.rating" :cancel="false" readonly />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </DataView>
        </template>
      </Card>
    </div>

  </div>

  <div class="flex">
    <div class="w-1/1 p-2">
      <Card>
        <template #title>Sales Overview</template>
        <template #subtitle>
          <div class="flex justify-end">
            <div class="flex gap-2">
              <Calendar v-model="searchDate" view="year" dateFormat="yy" />
              <Button icon="pi pi-search" />
            </div>
          </div>
        </template>
        <template #content>
          <Chart type="line" :data="lineData" :options="lineOptions" />
        </template>
      </Card>
    </div>
  </div></template>

<style scoped></style>

