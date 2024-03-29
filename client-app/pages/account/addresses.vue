<template>
  <div>
    <BackButtonInHeader v-if="isMobile && editingMode" @click="closeEditMode" />

    <!-- Title block -->
    <div class="flex justify-between items-center mx-5 md:mx-0">
      <h2 class="text-gray-800 text-3xl font-bold uppercase truncate">
        {{ title }}
      </h2>

      <VcButton
        v-if="!editingMode && paginatedAddresses.length"
        class="px-3 uppercase"
        size="sm"
        is-outline
        @click="openEditMode()"
      >
        <span class="sm:hidden">{{ $t("pages.account.addresses.add_new_address_button_mobile") }}</span>
        <span class="hidden sm:inline">{{ $t("pages.account.addresses.add_new_address_button") }}</span>
      </VcButton>
    </div>

    <VcEmptyView
      v-if="!paginatedAddresses.length && !editingMode && !addressesLoading"
      :text="$t('pages.account.addresses.no_addresses_message')"
    >
      <template #icon>
        <VcImage
          src="/static/images/account/icons/no-addresses.svg"
          :alt="$t('pages.account.addresses.addresses_icon')"
        />
      </template>

      <template #button>
        <VcButton class="px-6 uppercase" size="lg" @click="openEditMode">
          <i class="fa fa-plus text-inherit -ml-0.5 mr-2.5" />

          {{ $t("pages.account.addresses.add_new_address_button") }}
        </VcButton>
      </template>
    </VcEmptyView>

    <div v-else class="flex flex-col bg-white shadow-sm md:rounded md:border">
      <AddressForm
        v-if="editingMode"
        :model-value="editableAddress"
        :countries="countries"
        :disabled="saveAddressLoading"
        class="px-6 py-4"
        required-email
        required-city
        @save="saveAddress"
      >
        <template #append="{ dirty }">
          <div class="flex space-x-4 pb-3 pt-7 sm:pb-4 sm:pt-4 sm:float-right">
            <VcButton
              kind="secondary"
              :is-disabled="saveAddressLoading"
              class="uppercase w-32 sm:w-auto sm:px-12"
              is-outline
              @click="closeEditMode"
            >
              {{ $t("pages.account.addresses.cancel_button") }}
            </VcButton>

            <VcButton
              :is-disabled="!dirty"
              :is-waiting="saveAddressLoading"
              class="uppercase flex-grow sm:flex-none sm:px-16"
              is-submit
            >
              {{
                editableAddress
                  ? $t("pages.account.addresses.save_button")
                  : $t("pages.account.addresses.create_button")
              }}
            </VcButton>
          </div>
        </template>
      </AddressForm>

      <!-- View Table -->
      <VcTable
        v-else
        :loading="addressesLoading"
        :item-action-builder="actionBuilder"
        :columns="columns"
        :items="paginatedAddresses"
        :sort="sort"
        :pages="pages"
        :page="page"
        @pageChanged="onPageChange"
        @headerClick="applySorting"
      >
        <template #mobile-item="itemData">
          <div class="grid grid-cols-2 p-6 gap-y-4 border-b border-gray-200">
            <div class="flex flex-col">
              <span class="text-sm text-gray-400" v-t="'pages.account.addresses.recipient_name_label'" />

              <span class="pr-4 font-extrabold overflow-hidden overflow-ellipsis">
                {{ itemData.item.firstName }} {{ itemData.item.lastName }}
              </span>
            </div>

            <div class="flex flex-col">
              <span class="text-sm text-gray-400" v-t="'pages.account.addresses.address_label'" />

              <span class="overflow-hidden overflow-ellipsis">
                {{ itemData.item.countryCode }} {{ itemData.item.regionName }} {{ itemData.item.city }}
                {{ itemData.item.line1 }}
                {{ itemData.item.postalCode }}
              </span>
            </div>

            <div class="flex flex-col">
              <span class="text-sm text-gray-400" v-t="'pages.account.addresses.phone_label'" />

              <span class="pr-4 overflow-hidden overflow-ellipsis">
                {{ itemData.item.phone }}
              </span>
            </div>

            <div class="flex flex-col">
              <span class="text-sm text-gray-400" v-t="'pages.account.addresses.email_label'" />

              <span class="overflow-hidden overflow-ellipsis">
                {{ itemData.item.email }}
              </span>
            </div>
          </div>
        </template>

        <template #mobile-skeleton>
          <div v-for="i of itemsPerPage" :key="i" class="grid grid-cols-2 p-6 gap-y-4 border-b border-gray-200">
            <div class="flex flex-col">
              <span class="text-sm text-gray-400" v-t="'pages.account.addresses.recipient_name_label'"></span>
              <div class="h-6 mr-4 bg-gray-200 animate-pulse"></div>
            </div>

            <div class="flex flex-col">
              <span class="text-sm text-gray-400" v-t="'pages.account.addresses.address_label'"></span>
              <div class="h-6 bg-gray-200 animate-pulse"></div>
            </div>

            <div class="flex flex-col">
              <span class="text-sm text-gray-400" v-t="'pages.account.addresses.phone_label'"></span>
              <div class="h-6 mr-4 bg-gray-200 animate-pulse"></div>
            </div>

            <div class="flex flex-col">
              <span class="text-sm text-gray-400" v-t="'pages.account.addresses.email_label'"></span>
              <div class="h-6 bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        </template>

        <template #desktop-body>
          <tr v-for="address in paginatedAddresses" :key="address.id" class="even:bg-gray-50">
            <td class="p-5 overflow-hidden overflow-ellipsis">{{ address.firstName }} {{ address.lastName }}</td>

            <td class="p-5 overflow-hidden overflow-ellipsis">
              {{ address.countryCode }} {{ address.regionName }} {{ address.city }} {{ address.line1 }}
              {{ address.postalCode }}
            </td>

            <td class="p-5 overflow-hidden overflow-ellipsis">
              {{ address.phone }}
            </td>

            <td class="p-5 overflow-hidden overflow-ellipsis">
              {{ address.email }}
            </td>
            <!-- todo: https://virtocommerce.atlassian.net/browse/ST-2256 -->
            <td class="p-5 text-center">
              <div class="inline-block space-x-2">
                <!-- todo: use VcButton -->
                <button
                  type="button"
                  class="h-7 w-7 shadow rounded text-[color:var(--color-primary)] hover:bg-gray-100"
                  @click="openEditMode(address)"
                >
                  <i class="fas fa-pencil-alt" />
                </button>

                <button
                  type="button"
                  class="h-7 w-7 shadow rounded text-[color:var(--color-danger)] hover:bg-gray-100"
                  @click="removeAddress(address)"
                >
                  <i class="fas fa-times" />
                </button>
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
          </tr>
        </template>
      </VcTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AddressForm, useUser, useUserAddresses } from "@/shared/account";
import { computed, ComputedRef, onMounted, Ref, ref } from "vue";
import { clone } from "lodash";
import { MemberAddressType } from "@/xapi/types";
import { SORT_ASCENDING, SORT_DESCENDING } from "@/core/constants";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { BackButtonInHeader } from "@/shared/layout";
import { useCountries } from "@/core/composables";
import { AddressType } from "@/core/types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const breakpoints = useBreakpoints(breakpointsTailwind);
const { user } = useUser();
const { countries, loadCountries } = useCountries();
const {
  loading: addressesLoading,
  addresses,
  sort,
  loadAddresses,
  setDefaultAddress,
  removeAddresses,
  defaultShippingAddress,
  addOrUpdateAddresses,
} = useUserAddresses({ user });

const isMobile = breakpoints.smaller("lg");
const editingMode: Ref<boolean> = ref(false);
const editableAddress: Ref<MemberAddressType | null> = ref(null);
const page = ref(1);
const itemsPerPage = ref(6);
const saveAddressLoading = ref(false);

const pages: ComputedRef<number> = computed(() => Math.ceil(addresses.value.length / itemsPerPage.value));
const paginatedAddresses: ComputedRef<MemberAddressType[]> = computed(() =>
  addresses.value.slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value)
);
const title: ComputedRef<string> = computed(() => {
  if (editingMode.value) {
    return editableAddress.value
      ? `${editableAddress.value.firstName} ${editableAddress.value.lastName}`
      : t("pages.account.addresses.new_address_title");
  } else {
    return t("pages.account.addresses.addresses_title");
  }
});

const columns = ref<ITableColumn[]>([
  {
    id: "firstName",
    title: t("pages.account.addresses.recipient_name_label"),
    sortable: true,
  },
  {
    id: "countryCode",
    title: t("pages.account.addresses.address_label"),
    sortable: true,
  },
  {
    id: "phone",
    title: t("pages.account.addresses.phone_label"),
    sortable: true,
  },
  {
    id: "email",
    title: t("pages.account.addresses.email_label"),
    sortable: true,
  },
  {
    id: "actions",
    title: t("pages.account.addresses.actions_label"),
    titlePosition: "text-center",
  },
]);

const onPageChange = async (newPage: number) => {
  page.value = newPage;
};

// if address parameter is NULL, then adding a new address will open
async function openEditMode(address: MemberAddressType | null = null) {
  editableAddress.value = clone(address);
  editingMode.value = true;
}

function closeEditMode() {
  editableAddress.value = null;
  editingMode.value = false;
}

function actionBuilder(address: MemberAddressType) {
  const result = [
    {
      icon: "fas fa-pencil-alt",
      title: t("pages.account.addresses.edit_button"),
      bgColor: "bg-gray-300",
      clickHandler() {
        openEditMode(address);
      },
    },
    {
      icon: "fas fa-trash-alt",
      title: t("pages.account.addresses.delete_button"),
      leftActions: true,
      bgColor: "bg-[color:var(--color-danger)]",
      clickHandler() {
        removeAddress(address);
      },
    },
  ];

  if (defaultShippingAddress.value && address.id !== defaultShippingAddress.value.id) {
    result.push({
      icon: "fas fa-check",
      title: t("pages.account.addresses.make_default_button"),
      bgColor: "bg-[color:var(--color-primary)]",
      clickHandler() {
        setDefaultAddress(address);
      },
    });
  }

  return result;
}

const applySorting = async (column: string): Promise<void> => {
  if (sort.value.column === column) {
    sort.value.direction = sort.value.direction === SORT_DESCENDING ? SORT_ASCENDING : SORT_DESCENDING;
  } else {
    sort.value.column = column;
    sort.value.direction = SORT_DESCENDING;
  }

  page.value = 1;
  await loadAddresses();
};

async function saveAddress(address: MemberAddressType): Promise<void> {
  saveAddressLoading.value = true;
  await addOrUpdateAddresses([{ ...address, addressType: AddressType.BillingAndShipping }]);
  closeEditMode();
  saveAddressLoading.value = false;
}

async function removeAddress(address: MemberAddressType): Promise<void> {
  if (!window.confirm(t("pages.account.addresses.confirm_delete_message"))) {
    return;
  }

  await removeAddresses([address]);
}

onMounted(async () => {
  await loadAddresses();

  if (!countries.value.length) {
    await loadCountries();
  }
});
</script>
