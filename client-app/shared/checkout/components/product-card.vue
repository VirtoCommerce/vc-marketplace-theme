<template>
  <div class="border-b">
    <div class="p-5 flex flex-wrap overflow-hidden space-x-4 lg:space-x-6">
      <div class="border border-gray-100 w-16 h-16">
        <VcImage
          :src="lineItem.imageUrl"
          :alt="lineItem.name"
          size-suffix="sm"
          class="w-full h-full object-cover object-center"
          lazy
        />
      </div>

      <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center flex-1">
        <div class="mb-3 lg:mb-0 text-sm xl:w-1/2">
          <div class="mb-1">
            <router-link :to="link" class="text-[color:var(--color-link)] font-extrabold line-clamp-3 overflow-hidden">
              {{ lineItem.name }}
            </router-link>
            <div class="flex items-center space-x-1 py-1" v-if="validationError">
              <i class="fas fa-exclamation-circle text-[color:var(--color-primary)]"></i>
              <span class="text-xs text-gray-400"> {{ itemErrorMessage }} </span>
            </div>
          </div>
          <div class="flex flex-col space-y-1 lg:space-y-0">
            <div class="flex">
              <span class="font-medium lg:font-extrabold text-gray-500 lg:text-black pr-1"
                >{{ $t("shared.checkout.product_card.brand_label") }}
              </span>
              <span class="h-4 mx-2 border-b-2 flex-1 border-gray-100 border-dotted lg:hidden"></span>
              <span class="w-1/3 lg:w-auto font-bold lg:font-medium">{{ lineItem.product?.brandName }}</span>
            </div>
            <div class="flex">
              <span class="font-medium lg:font-extrabold text-gray-500 lg:text-black pr-1"
                >{{ $t("shared.checkout.product_card.price_label") }}
              </span>
              <span class="h-4 mx-2 border-b-2 flex-1 border-gray-100 border-dotted lg:hidden"></span>
              <p class="w-1/3 lg:w-auto">
                <VcItemPrice
                  :price-color-class="isMobile ? 'text-black' : undefined"
                  :value="{ list: lineItem.listPrice || lineItem.placedPrice, sale: lineItem.salePrice }"
                />
              </p>
            </div>
            <div class="flex text-sm lg:hidden">
              <span class="font-medium text-gray-500">{{ $t("shared.checkout.product_card.total_label") }} </span>
              <span class="h-4 mx-2 border-b-2 flex-1 border-gray-100 border-dotted lg:hidden"></span>
              <span class="w-1/3 text-green-700 font-extrabold"
                ><VcPriceDisplay :value="lineItem.extendedPrice"
              /></span>
            </div>
          </div>
        </div>

        <div class="flex items-start space-x-2 lg:space-x-4 xl:w-2/5 lg:justify-end">
          <div class="flex flex-col max-w-[5.75rem] lg:items-center lg:max-w-[4.75rem] lg:shrink-0">
            <input
              v-model="value"
              type="number"
              pattern="\d*"
              :max="maxQty"
              :min="minQty"
              class="w-[5.625rem] h-[32px] border rounded overflow-hidden focus:ring ring-inset outline-none p-1 text-center lg:w-[3.75rem] lg:h-10"
              :class="{
                'text-[color:var(--color-danger)]': isInputDisabled,
                'border-[color:var(--color-danger)]': errorMessage,
              }"
              :disabled="isInputDisabled || readOnly"
              @change="updateQuantity"
              @input="onInput"
              @keypress="onKeypress"
              @keyup.enter="updateQuantity"
            />

            <div class="relative mt-1.5 pt-px h-6">
              <VcInStock
                v-if="!readOnly"
                :is-in-stock="!isInputDisabled"
                :quantity="lineItem.inStockQuantity"
                class="absolute lg:static"
              ></VcInStock>
            </div>
          </div>

          <div v-if="!readOnly" class="lg:hidden">
            <VcButton
              size="sm"
              kind="secondary"
              is-outline
              class="uppercase px-2"
              @click="$emit('remove:item', lineItem.id)"
            >
              {{ $t("shared.checkout.product_card.remove_button") }}
            </VcButton>
          </div>

          <div
            v-if="!readOnly"
            class="hidden lg:flex flex-col justify-center h-10 xl:w-1/4 text-xs font-semibold text-[color:var(--color-link)]"
          >
            <!-- todo: https://virtocommerce.atlassian.net/browse/ST-2256 -->
            <button
              type="button"
              :title="$t('shared.checkout.product_card.remove_button')"
              class="h-7 w-7 shadow rounded text-[color:var(--color-danger)] hover:bg-gray-100"
              @click="$emit('remove:item', lineItem.id)"
            >
              <i class="fas fa-times" />
            </button>
          </div>

          <div class="hidden lg:flex lg:w-28 lg:shrink-0 xl:w-2/4 lg:items-end flex-col text-sm font-extrabold pr-3">
            <span class="text-black self-end" v-t="'shared.checkout.product_card.total_label'"></span>
            <span class="text-green-700"><VcPriceDisplay :value="lineItem.extendedPrice" /></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LineItemType, ValidationErrorType } from "@/xapi/types";
import { computed, PropType } from "vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { useField } from "vee-validate";
import * as yup from "yup";
import { useI18n } from "vue-i18n";
import { RouteLocationRaw } from "vue-router";
import { getProductRoute } from "@/shared/catalog";

const breakpoints = useBreakpoints(breakpointsTailwind);
const { t } = useI18n();

const isMobile = breakpoints.smaller("lg");

// Define max qty available to add
const max = 999999;

const props = defineProps({
  lineItem: {
    type: Object as PropType<LineItemType>,
    required: true,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  validationError: {
    type: Object as PropType<ValidationErrorType>,
    default: undefined,
  },
});

const count = computed(() => props.lineItem.quantity);
const variation = computed(() => props.lineItem.product?.variations?.find((v) => v.id === props.lineItem.productId));
const minQty = computed(
  () => (variation.value ? variation.value?.minQuantity : props.lineItem.product?.minQuantity) || 0
);
const maxQty = computed(
  () => (variation.value ? variation.value?.maxQuantity : props.lineItem.product?.maxQuantity) || max
);

const link = computed<RouteLocationRaw>(() =>
  getProductRoute(props.lineItem.product!.masterVariation || props.lineItem.product!)
);

const itemErrorMessage = computed(() => {
  if (props.validationError?.errorCode === "PRODUCT_PRICE_CHANGED") {
    return t("shared.checkout.product_card.errors.product_price_changed", [
      Number(props.validationError.errorParameters?.find((error) => error.key === "new_price")?.value).toFixed(2),
    ]);
  } else {
    return props.validationError?.errorMessage;
  }
});

let rules = yup.number().integer().optional().moreThan(0);
rules = rules.min(minQty.value);

if (props.lineItem.inStockQuantity) {
  rules = rules.max(Math.min(props.lineItem.inStockQuantity, maxQty.value, max));
}

const { value, validate, errorMessage } = useField("qty", rules, {
  initialValue: props.lineItem.inStockQuantity === 0 ? 0 : count,
});

const isInputDisabled = computed(() => props.lineItem.inStockQuantity === 0);

const updateQuantity = () => {
  if (!isInputDisabled.value) {
    emit("update:quantity", props.lineItem.id, value.value || 0);
  }
};

validate();

const emit = defineEmits(["update:quantity", "remove:item"]);
defineExpose({ updateQuantity });

/**
 * Ignore non-numeric keys.
 */
const onKeypress = (event: KeyboardEvent) => {
  if (!/[0-9]/.test(event.key) && event.key !== "Enter") {
    event.preventDefault();
  }
};

/**
 * Limit max value.
 */
const onInput = () => {
  if (value.value && value.value > max) {
    value.value = max;
  }
  if (!value.value) {
    value.value = undefined;
  }
};
</script>

<style scoped></style>
