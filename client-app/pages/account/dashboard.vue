<template>
  <div>
    <!-- Title block -->
    <div class="flex justify-between items-center mx-5 md:mx-0 lg:hidden">
      <h2 class="text-gray-800 text-3xl font-bold uppercase" v-t="'pages.account.dashboard.title'" />
    </div>

    <VcCard :title="$t('pages.account.dashboard.last_orders_card.title')" class="mx-5 md:mx-0" full-width-content>
      <template #header-button>
        <div v-if="isMobile">
          <VcButton :to="{ name: 'Orders' }" :is-outline="true" class="px-2 uppercase text-sm">
            {{ $t("pages.account.dashboard.last_orders_card.all_orders_link") }}
          </VcButton>
        </div>

        <div class="flex items-center" v-else>
          <router-link
            :to="{ name: 'Orders' }"
            class="text-xs text-blue-500 hover:text-blue-700 font-bold mr-3"
            v-t="'pages.account.dashboard.last_orders_card.all_orders_link'"
          />

          <i class="fas fa-arrow-right text-[color:var(--color-primary)]" />
        </div>
      </template>

      <VcTable
        :loading="ordersLoading"
        :columns="columns"
        :items="orders"
        :sort="sort"
        :footer="false"
        @itemClick="openOrderDetails"
      >
        <template #mobile-item="itemData">
          <div class="grid grid-cols-3 p-6 gap-y-4 gap-x-8 border-b border-gray-200 cursor-pointer">
            <div class="flex flex-col text-sm">
              <span class="text-gray-400" v-t="'pages.account.dashboard.last_orders_card.order_number_label'" />

              <span class="font-extrabold overflow-hidden overflow-ellipsis">
                {{ itemData.item.number }}
              </span>
            </div>

            <div class="flex flex-col text-sm">
              <span class="text-gray-400" v-t="'pages.account.dashboard.last_orders_card.purchase_number_label'" />

              <span class="overflow-hidden overflow-ellipsis">
                {{ itemData.item.purchaseOrderNumber }}
              </span>
            </div>

            <div class="flex flex-col justify-start">
              <TableStatusBadge :status="itemData.item.status" />
            </div>

            <div class="flex flex-col text-sm">
              <span class="text-gray-400" v-t="'pages.account.dashboard.last_orders_card.invoice_label'" />

              <span class="overflow-hidden overflow-ellipsis">
                {{ itemData.item.inPayments?.[0]?.number }}
              </span>
            </div>

            <div class="flex flex-col text-sm">
              <span class="text-gray-400" v-t="'pages.account.dashboard.last_orders_card.date_label'" />

              <span class="overflow-hidden overflow-ellipsis">
                {{ $d(itemData.item?.createdDate) }}
              </span>
            </div>

            <div class="flex flex-col text-sm">
              <span class="text-gray-400" v-t="'pages.account.dashboard.last_orders_card.total_label'" />

              <span class="font-extrabold overflow-hidden overflow-ellipsis">
                {{ itemData.item.total?.formattedAmount }}
              </span>
            </div>
          </div>
        </template>

        <template #mobile-empty>
          <div class="flex items-center justify-center space-x-10 p-5">
            <img
              src="/static/images/account/icons/no-addresses.svg"
              :alt="$t('pages.account.dashboard.last_orders_card.no_orders_img_alt')"
            />

            <div class="flex flex-col space-y-2">
              <span class="text-base" v-t="'pages.account.dashboard.last_orders_card.no_orders_message'" />
            </div>
          </div>
        </template>

        <template #mobile-skeleton>
          <div v-for="i of itemsPerPage" :key="i" class="grid grid-cols-3 p-6 gap-y-4 gap-x-8 border-b border-gray-200">
            <div class="flex flex-col">
              <span
                class="text-sm text-gray-400"
                v-t="'pages.account.dashboard.last_orders_card.order_number_label'"
              ></span>
              <div class="h-6 mr-4 bg-gray-200 animate-pulse"></div>
            </div>

            <div class="flex flex-col">
              <span
                class="text-sm text-gray-400"
                v-t="'pages.account.dashboard.last_orders_card.purchase_number_label'"
              ></span>
              <div class="h-6 mr-4 bg-gray-200 animate-pulse"></div>
            </div>

            <div class="flex flex-col">
              <span class="text-sm text-gray-400" v-t="'pages.account.dashboard.last_orders_card.status_label'"></span>
              <div class="h-6 bg-gray-200 animate-pulse"></div>
            </div>

            <div class="flex flex-col">
              <span class="text-sm text-gray-400" v-t="'pages.account.dashboard.last_orders_card.invoice_label'"></span>
              <div class="h-6 bg-gray-200 animate-pulse"></div>
            </div>

            <div class="flex flex-col">
              <span class="text-sm text-gray-400" v-t="'pages.account.dashboard.last_orders_card.date_label'"></span>
              <div class="h-6 bg-gray-200 animate-pulse"></div>
            </div>

            <div class="flex flex-col">
              <span class="text-sm text-gray-400" v-t="'pages.account.dashboard.last_orders_card.total_label'"></span>
              <div class="h-6 mr-4 bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        </template>

        <template #desktop-body>
          <tr
            v-for="order in orders"
            :key="order.id"
            class="even:bg-gray-50 hover:bg-gray-200 cursor-pointer"
            @click="openOrderDetails(order)"
          >
            <td class="p-5 overflow-hidden overflow-ellipsis">
              {{ order.number }}
            </td>

            <td class="p-5 overflow-hidden overflow-ellipsis">
              {{ order.purchaseOrderNumber }}
            </td>

            <td class="p-5 overflow-hidden overflow-ellipsis">
              {{ order.inPayments?.[0]?.number }}
            </td>

            <td class="p-5 overflow-hidden overflow-ellipsis">
              {{ $d(order?.createdDate) }}
            </td>

            <td class="p-5 overflow-hidden overflow-ellipsis">
              <TableStatusBadge :status="order.status" class="mx-auto" />
            </td>

            <td class="p-5 overflow-hidden overflow-ellipsis text-right">
              {{ order.total?.formattedAmount }}
            </td>
          </tr>
        </template>

        <template #desktop-empty>
          <!-- Workaround for using colspan -->
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <tr>
            <td colspan="6" class="polygons-bg">
              <div class="flex items-center pl-56 space-x-10 h-80">
                <img
                  src="/static/images/account/icons/no-addresses.svg"
                  :alt="$t('pages.account.dashboard.last_orders_card.no_orders_img_alt')"
                />

                <div class="flex flex-col space-y-2">
                  <span class="text-base" v-t="'pages.account.dashboard.last_orders_card.no_orders_message'" />
                </div>
              </div>
            </td>
          </tr>
        </template>

        <template #desktop-skeleton>
          <tr v-for="i of itemsPerPage" :key="i" class="even:bg-gray-50">
            <td class="p-5">
              <div class="h-6 bg-gray-200 animate-pulse"></div>
            </td>

            <td class="w-4/12 p-5">
              <div class="h-6 bg-gray-200 animate-pulse"></div>
            </td>

            <td class="p-5">
              <div class="h-6 bg-gray-200 animate-pulse"></div>
            </td>

            <td class="p-5">
              <div class="h-6 bg-gray-200 animate-pulse"></div>
            </td>

            <td class="p-5">
              <div class="h-6 bg-gray-200 animate-pulse"></div>
            </td>

            <td class="p-5">
              <div class="h-6 bg-gray-200 animate-pulse"></div>
            </td>
          </tr>
        </template>
      </VcTable>
    </VcCard>

    <div class="flex flex-col lg:flex-row mx-5 md:mx-0 gap-y-5 lg:gap-y-0 lg:gap-x-5">
      <VcCard :title="$t('pages.account.dashboard.monthly_report_card.title')" class="lg:w-1/2">
        <div class="flex content-center space-x-9 lg:space-x-4">
          <VcImage
            src="/static/images/dashboard/spend-chart.svg"
            class="h-24 w-24"
            :alt="$t('pages.account.dashboard.monthly_report_card.spend_chart_alt')"
            lazy
          />

          <div
            class="flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:flex-wrap sm:space-x-5 sm:items-center xl:space-x-7 justify-center"
          >
            <div class="flex flex-col lg:items-center lg:space-y-3">
              <span
                class="text-xs text-gray-400 lg:text-gray-600 lg:font-bold"
                v-t="'pages.account.dashboard.monthly_report_card.budget_title'"
              />

              <span class="text-xl font-extrabold">$58,152</span>
            </div>

            <div class="flex flex-col lg:items-center lg:space-y-3">
              <span
                class="text-xs text-gray-400 lg:text-gray-600 lg:font-bold"
                v-t="'pages.account.dashboard.monthly_report_card.total_spend_label'"
              />

              <span class="text-xl font-extrabold">$530,152</span>
            </div>
          </div>
        </div>
      </VcCard>

      <VcCard :title="$t('pages.account.dashboard.orders_status_card.title')" class="h-52 lg:h-auto lg:w-1/2"></VcCard>
    </div>

    <!-- Commented due to acceptance criteria, will be used in future
    <VcCard title="Users" class="h-52 mx-5 md:mx-0"></VcCard> -->
  </div>
</template>

<script setup lang="ts">
import { CustomerOrderType } from "@/xapi/types";
import { SORT_DESCENDING } from "@/core/constants";
import useUserOrders from "@/shared/account/composables/useUserOrders";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller("md");

const { loading: ordersLoading, orders, loadOrders, sort, itemsPerPage } = useUserOrders();

const columns = ref<ITableColumn[]>([
  {
    id: "number",
    title: t("pages.account.dashboard.last_orders_card.order_number_label"),
  },
  {
    id: "purchaseOrder",
    title: t("pages.account.dashboard.last_orders_card.purchase_number_label"),
  },
  {
    id: "invoice",
    title: t("pages.account.dashboard.last_orders_card.invoice_label"),
  },
  {
    id: "createdDate",
    title: t("pages.account.dashboard.last_orders_card.date_label"),
  },
  {
    id: "status",
    title: t("pages.account.dashboard.last_orders_card.status_label"),
    titlePosition: "text-center",
  },
  {
    id: "total",
    title: t("pages.account.dashboard.last_orders_card.total_label"),
    titlePosition: "text-right",
  },
]);

const router = useRouter();

const openOrderDetails = (item: CustomerOrderType) => {
  router.push({ name: "OrderDetails", params: { orderId: item.id } });
};

onMounted(async () => {
  sort.value.column = "createdDate";
  sort.value.direction = SORT_DESCENDING;
  itemsPerPage.value = 4;
  await loadOrders();
});
</script>

<style scoped>
.polygons-bg {
  background-image: url(/static/images/account/addresses-bg.svg);
  background-repeat: no-repeat;
  background-position: right;
}
</style>
