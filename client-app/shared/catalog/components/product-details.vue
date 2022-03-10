<template>
  <div class="flex flex-grow flex-col lg:flex-row p-6 lg:space-x-12 bg-white">
    <div class="lg:w-1/3 mb-8 lg:mb-0">
      <VcImageGallery :src="product.imgSrc ?? ''" :images="product.images ?? []" :is-mobile="isMobile" />
    </div>

    <div class="flex flex-col lg:w-2/3">
      <ProductTitledBlock class="mt-5" image-src="/static/images/technical_specs.svg" title="Details">
        <ProductProperties v-if="product.properties" :properties="product.properties" />
      </ProductTitledBlock>

      <!-- variations  -->
      <div v-if="product.variations?.length" class="mt-5">
        <ProductVariationCard class="mb-5" :variation="product" v-if="product.price?.actual?.amount" />

        <div v-for="(variation, i) in product.variations" :key="variation?.id ?? i">
          <ProductVariationCard
            v-if="variation && variation.price?.actual?.amount"
            class="mb-5"
            :variation="variation"
            :product="product"
          />
        </div>
      </div>

      <ProductTitledBlock
        v-if="product.description"
        class="mt-5"
        image-src="/static/images/description.svg"
        title="Description"
      >
        <VcMarkdownRender :src="product.description?.content" class="text-gray-500"></VcMarkdownRender>
      </ProductTitledBlock>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Product } from "@/core/api/graphql/types";
import { PropType } from "vue";
import { VcMarkdownRender, VcImageGallery } from "@/components";
import { ProductProperties, ProductTitledBlock, ProductVariationCard } from "@/shared/catalog";
import { useBreakpoints, breakpointsTailwind } from "@vueuse/core";

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller("lg");

defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true,
  },
});
</script>
