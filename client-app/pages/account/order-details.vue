<template>
  <div class="bg-gray-100 pt-7 pb-16 shadow-inner">
    <div class="w-full max-w-screen-2xl mx-auto pb-5 px-5 md:px-12">
      <VcBreadcrumbs :items="breadcrumbs"></VcBreadcrumbs>
    </div>

    <div class="max-w-screen-2xl md:px-12 mx-auto">
      <h2 class="text-gray-800 px-5 md:px-0 text-2xl lg:text-3xl font-bold uppercase mb-2">
        {{ $t("pages.account.order_details.title", [order?.number]) }}
      </h2>
      <div class="flex px-5 md:px-0 mb-5 space-x-4">
        <div class="text-sm">
          <span class="font-bold">{{ $t("pages.account.order_details.status_label") }} </span>{{ order?.status }}
        </div>
        <div class="text-sm">
          <span class="font-bold">{{ $t("pages.account.order_details.placed_on_label") }} </span
          >{{ moment(order?.createdDate).format("MMM DD, YYYY HH:mm:ss A") }}
        </div>
      </div>
      <div class="flex flex-col lg:flex-row lg:flex-nowrap lg:space-x-6">
        <!-- Main section -->
        <div class="lg:w-3/4 xl:w-4/5 flex-grow w-full">
          <!-- My products section -->
          <VcSection
            :title="$t('pages.account.order_details.products_section.title')"
            icon-url="/static/images/checkout/products.svg"
            class="shadow lg:pb-11"
          >
            <div class="lg:ml-28 lg:mr-11 lg:border lg:rounded">
              <!-- Product card -->
              <ProductCard v-for="item in orderItems" :key="item?.id" :line-item="item" :read-only="true"></ProductCard>

              <div v-if="pages > 1" class="py-8 lg:flex lg:items-center lg:px-5">
                <VcPagination
                  v-model:page="page"
                  :pages="pages"
                  class="mb-3 lg:mb-0"
                  @update:page="page = $event"
                ></VcPagination>
              </div>
            </div>
          </VcSection>

          <!-- Gifts section -->
          <AcceptedGifts :items="giftItems" />

          <!-- Order comment section -->
          <VcSection
            v-if="order?.comment"
            :title="$t('pages.account.order_details.order_comment_section.title')"
            icon-url="/static/images/checkout/extra.svg"
            class="shadow-inner pb-8 lg:shadow"
          >
            <div class="ml-24 mr-5 lg:ml-28 lg:mr-11">
              <p class="break-words">
                {{ order?.comment }}
              </p>
            </div>
          </VcSection>
          <div class="shadow-inner h-1 lg:hidden"></div>
        </div>

        <!-- Sidebar -->
        <div class="flex flex-col px-5 mb-7 order-first md:px-0 lg:mb-0 lg:order-1 lg:w-1/4">
          <!-- Order summary -->
          <OrderSummary v-if="order" :cart="order" class="mb-5" />

          <VcButton class="uppercase w-full mb-5" @click="openReorderPopup">
            {{ $t("pages.account.order_details.reorder_all_button") }}
          </VcButton>

          <VcCard
            :title="$t('pages.account.order_details.shipping_address_card.title')"
            :is-collapsible="true"
            class="mb-5"
          >
            <div class="flex flex-col text-sm">
              <span class="font-extrabold">{{ deliveryAddress?.firstName }} {{ deliveryAddress?.lastName }}</span>
              <p>
                {{ deliveryAddress?.countryCode }}
                {{ deliveryAddress?.regionName }}
                {{ deliveryAddress?.city }}
                {{ deliveryAddress?.line1 }}
                {{ deliveryAddress?.postalCode }}
              </p>
              <p>
                <span class="font-extrabold" v-t="'pages.account.order_details.shipping_address_card.phone_label'">
                </span>
                {{ deliveryAddress?.phone }}
              </p>
              <p>
                <span
                  class="font-extrabold"
                  v-t="'pages.account.order_details.shipping_address_card.email_label'"
                ></span>
                {{ deliveryAddress?.email }}
              </p>
            </div>
          </VcCard>

          <VcCard
            :title="$t('pages.account.order_details.shipping_method_card.title')"
            :is-collapsible="true"
            class="mb-5"
          >
            <div class="flex items-center space-x-4 text-sm">
              <VcImage src="/static/images/checkout/fedex.svg" class="h-12 w-12" />
              <span
                >{{ order?.shipments?.[0]?.shipmentMethodCode }} {{ order?.shipments?.[0]?.shipmentMethodOption }} ({{
                  order?.shipments?.[0]?.price?.formattedAmount
                }})</span
              >
            </div>
          </VcCard>

          <VcCard
            :title="$t('pages.account.order_details.payment_details_card.title')"
            :is-collapsible="true"
            class="mb-5"
          >
            <div class="flex flex-col text-sm">
              <p>
                <span class="font-extrabold">{{
                  $t("pages.account.order_details.payment_details_card.payment_number_label")
                }}</span>
                {{ order?.inPayments?.[0]?.number }}
              </p>
              <p>
                <span class="font-extrabold">{{
                  $t("pages.account.order_details.payment_details_card.payment_type_label")
                }}</span>
                {{ order?.inPayments?.[0]?.gatewayCode }}
              </p>
              <div class="mt-3">
                <VcButton class="px-2 py-1 uppercase text-xs" size="xs" is-outline :is-disabled="true">
                  {{ $t("pages.account.order_details.payment_details_card.view_invoice_button") }}
                </VcButton>
              </div>
            </div>
          </VcCard>

          <VcCard
            :title="$t('pages.account.order_details.billing_address_card.title')"
            :is-collapsible="true"
            class="mb-5"
          >
            <div class="flex flex-col text-sm">
              <span class="font-extrabold">{{ billingAddress?.firstName }} {{ billingAddress?.lastName }}</span>
              <p>
                {{ billingAddress?.countryCode }}
                {{ billingAddress?.regionName }}
                {{ billingAddress?.city }}
                {{ billingAddress?.line1 }}
                {{ billingAddress?.postalCode }}
              </p>
              <p>
                <span class="font-extrabold">{{
                  $t("pages.account.order_details.billing_address_card.phone_label")
                }}</span>
                {{ billingAddress?.phone }}
              </p>
              <p>
                <span class="font-extrabold">{{
                  $t("pages.account.order_details.billing_address_card.email_label")
                }}</span>
                {{ billingAddress?.email }}
              </p>
            </div>
          </VcCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OrderSummary, ProductCard, AcceptedGifts } from "@/shared/checkout";
import { computed, onMounted, ref } from "vue";
import { VcCard, VcImage, VcPagination, VcButton, VcSection, VcBreadcrumbs, IBreadcrumbs } from "@/components";
import { useRoute } from "vue-router";
import { ReorderInfo, useUserOrder } from "@/shared/account";
import moment from "moment";
import _ from "lodash";
import { usePopup } from "@/shared/popup";
import { useProducts } from "@/shared/catalog";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const { itemsPerPage, pages, order, deliveryAddress, billingAddress, loadOrder } = useUserOrder();
const { fetchProducts, products } = useProducts();
const { openPopup } = usePopup();

const route = useRoute();
const orderId = ref(route.params.id as string);

const page = ref(1);
const orderItems = computed(() =>
  order.value?.items
    ?.filter((item) => !item.isGift)
    ?.slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value)
);

const giftItems = computed(() => order.value?.items?.filter((item) => item.isGift));

const breadcrumbs = ref<IBreadcrumbs[]>([
  { title: t("common.links.home"), route: "/" },
  { title: t("common.links.account"), route: "/account" },
  { title: t("common.links.orders"), route: "/account/orders" },
]);

const openReorderPopup = async () => {
  const orderItemsInfo = order.value?.items
    .filter((item) => !item.isGift)
    .map((item) => {
      return _.pick(item, "productId", "quantity", "id");
    });
  const productIds = _.map(orderItemsInfo, (item) => {
    return item.productId;
  });
  await fetchProducts({ itemsPerPage: 6, productIds: productIds });
  openPopup({
    component: ReorderInfo,
    props: {
      productItems: products.value,
      orderItemsInfo: orderItemsInfo,
    },
  });
};

onMounted(async () => {
  await loadOrder(orderId.value);
  breadcrumbs.value.push({ title: `${order.value?.number}`, route: `/account/order-details/${order.value?.id}` });
});
</script>