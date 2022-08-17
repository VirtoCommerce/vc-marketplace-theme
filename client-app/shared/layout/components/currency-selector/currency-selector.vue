<template>
  <div v-click-outside="() => open && hideList()" class="relative select-none text-[13px]">
    <button
      class="relative flex items-center space-x-1 py-3 pr-3.5 appearance-none leading-none text-[color:var(--color-header-top-link)] hover:text-[color:var(--color-header-top-link-hover)]"
      @click="toggle"
    >
      <span class="text-white mr-1">
        {{ $t("shared.layout.currency_selector.label") }}
      </span>

      <span>
        {{ currentCurrency?.code }}
      </span>

      <span class="absolute inset-y-0 -right-3.5 flex items-center pointer-events-none lg:right-0">
        <i
          class="text-[color:var(--color-mobile-menu-link)] fas text-[1rem] lg:text-[color:var(--color-primary)] lg:text-[0.625rem]"
          :class="[open ? 'fa-chevron-up' : 'fa-chevron-down']"
        />
      </span>
    </button>

    <transition name="slide-fade-top">
      <div v-show="open" class="absolute right-0 z-30 bg-white shadow-lg max-h-56 rounded border overflow-hidden">
        <ul ref="listElement" class="max-h-56 overflow-auto divide-y">
          <li
            v-for="item in supportedCurrencies"
            :key="item.code"
            :class="[item.code === currentCurrency?.code ? 'cursor-default' : 'cursor-pointer']"
            class="flex items-center p-2.5 pr-3 font-normal text-[color:var(--color-link)] hover:text-[color:var(--color-link-hover)]"
            @click="item.code === currentCurrency?.code ? null : select(item.code)"
          >
            <span
              class="flex shrink-0 items-center justify-center w-6 h-6 rounded-[50%] bg-[color:var(--color-primary)] text-white text-base font-bold mr-2"
            >
              {{ item.symbol }}
            </span>

            <span :class="{ 'font-bold text-black': item.code === currentCurrency?.code }">
              {{ item.code }}
            </span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { clickOutside } from "@/core/directives";

export default {
  directives: {
    clickOutside, // VueUse (v7.5.5) onClickOutside doesn't work in Safari
  },
};
</script>

<script setup lang="ts">
import { ref, shallowRef } from "vue";
import { useCurrency } from "@/core/composables";

const { currentCurrency, supportedCurrencies, saveCurrencyCodeAndReload } = useCurrency();

const open = ref(false);
const listElement = shallowRef<HTMLElement | null>(null);

function hideList() {
  const HIDE_TIMEOUT = 350;
  open.value = false;

  setTimeout(() => {
    if (listElement.value) {
      listElement.value.scrollTop = 0;
    }
  }, HIDE_TIMEOUT);
}

function toggle() {
  if (open.value) {
    hideList();
  } else {
    open.value = true;
  }
}

function select(code: string) {
  saveCurrencyCodeAndReload(code);
  hideList();
}
</script>