<template>
  <div class="bg-gray-100 pt-7 pb-16 shadow-inner grow">
    <div class="max-w-screen-2xl px-5 md:px-12 mx-auto">
      <div class="flex items-start lg:gap-6">
        <!-- Content -->
        <div class="lg:w-3/4 xl:w-4/5 flex-grow">
          <template v-if="products.length || loading">
            <div class="flex flex-col">
              <h1 class="text-2xl md:mt-2 md:mb-4" v-html="$t('pages.search.header', [searchParams.keyword])"></h1>
              <div class="flex justify-start mb-6 mt-4">
                <!-- View options -->
                <ViewMode v-model:mode="viewMode" class="hidden md:inline-flex mr-6" />

                <!-- Sorting -->
                <div class="flex items-center flex-grow md:flex-grow-0 ml-auto">
                  <span class="shrink-0 mr-2" v-t="'pages.search.sort_by_label'"></span>

                  <VcSelect
                    v-model="sortQueryParam"
                    text-field="name"
                    value-field="id"
                    :is-disabled="loading"
                    :items="PRODUCT_SORTING_LIST"
                    class="w-full md:w-52 lg:w-64"
                  />
                </div>
              </div>
            </div>

            <!-- Products -->
            <DisplayProducts
              :loading="loading"
              :view-mode="isMobile ? 'grid' : viewMode"
              :items-per-page="itemsPerPage"
              :products="products"
              :class="
                viewMode === 'list' && !isMobile
                  ? 'space-y-5'
                  : 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-5 xl:gap-x-6 xl:gap-y-8'
              "
            >
              <template #cart-handler="{ item }">
                <VcButton
                  v-if="item.hasVariations"
                  :to="productsRoutes[item.id]"
                  :class="{ 'w-full': viewMode === 'list' }"
                  class="uppercase mb-4"
                >
                  {{ $t("pages.search.choose_button") }}
                </VcButton>

                <AddToCart v-else :product="item"></AddToCart>
              </template>
            </DisplayProducts>

            <VcInfinityScrollLoader
              v-if="!loading"
              :loading="loadingMore"
              distance="400"
              class="mt-9 -mb-6"
              @visible="loadMoreProducts"
            />
            <VcScrollTopButton></VcScrollTopButton>
          </template>

          <!-- Not found -->
          <div v-else class="my-16 text-center">
            <svg width="47" height="47" class="inline-block mb-4 md:mb-0 md:mr-5 text-primary">
              <use href="/static/images/search-not-found.svg#search-not-found" />
            </svg>

            <p class="md:inline-block" v-html="$t('pages.search.no_results_message', [searchParams.keyword])"></p>

            <div class="md:hidden mt-10">
              <VcButton to="/" size="md" class="w-40 uppercase">
                {{ $t("pages.search.home_button") }}
              </VcButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, ref, onBeforeUnmount, WatchStopHandle } from "vue";
import { breakpointsTailwind, useBreakpoints, useLocalStorage } from "@vueuse/core";
import { DisplayProducts, ProductsSearchParams, useProducts, useProductsRoutes, ViewMode } from "@/shared/catalog";
import { AddToCart } from "@/shared/cart";
import { useRouteQueryParam } from "@/core/composables";
import { DEFAULT_SEARCH_PAGE_SIZE, PRODUCT_SORTING_LIST } from "@/core/constants";
import QueryParamName from "@/core/query-param-name.enum";

const watchStopHandles: WatchStopHandle[] = [];

const breakpoints = useBreakpoints(breakpointsTailwind);
const { fetchProducts, fetchMoreProducts, loading, loadingMore, products, pages } = useProducts();

const productsRoutes = useProductsRoutes(products);

const isMobile = breakpoints.smaller("md");
const page = ref(1);
const itemsPerPage = ref(DEFAULT_SEARCH_PAGE_SIZE);

const viewMode = useLocalStorage<"grid" | "list">("viewMode", "grid");

const sortQueryParam = useRouteQueryParam<string>(QueryParamName.Sort, {
  defaultValue: PRODUCT_SORTING_LIST[0].id,
  validator: (value) => PRODUCT_SORTING_LIST.some((item) => item.id === value),
});

const keywordQueryParam = useRouteQueryParam<string>(QueryParamName.SearchPhrase, {
  defaultValue: "",
});

const searchParams = computed<ProductsSearchParams>(() => ({
  itemsPerPage: itemsPerPage.value,
  sort: sortQueryParam.value,
  keyword: keywordQueryParam.value,
}));

async function loadProducts() {
  page.value = 1;
  await fetchProducts(searchParams.value);
}

async function loadMoreProducts() {
  if (page.value === pages.value) {
    return;
  }

  const nextPage = page.value + 1;

  page.value = nextPage;

  await fetchMoreProducts({
    ...searchParams.value,
    page: nextPage,
  });
}

onMounted(async () => {
  await loadProducts();

  // Start change tracking after initial data load
  watchStopHandles.push(
    /**
     * You must force the watch to stop before unmounting the component
     * because the computed value being watched includes the global reactive object.
     * In this case, it is the "current route" inside the "useRouteQueryParam" function.
     *
     * Related links:
     * https://github.com/vuejs/core/issues/2291
     */
    watch(
      computed(() => JSON.stringify(searchParams.value)),
      loadProducts,
      {
        flush: "post",
      }
    )
  );
});

onBeforeUnmount(() => {
  watchStopHandles.forEach((watchStopHandle) => watchStopHandle());
});
</script>
