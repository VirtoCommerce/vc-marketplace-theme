<template>
  <form class="flex flex-col gap-y-3" autocomplete="off">
    <VcInput
      v-mask="'#### #### #### #### ###'"
      :model-value="number.replace(/(.{4})/g, '$1 ')"
      @update:model-value="number = $event.replace(/\D/g, '')"
      :label="$t('shared.payment.bank_card_form.number_label')"
      :error-message="formErrors.number || errors.number"
      :is-readonly="isReadonly"
      :is-disabled="isDisabled"
      placeholder="1111 1111 1111 1111"
      minlength="14"
      maxlength="23"
      is-required
      @input="input"
    />

    <VcInput
      v-model="cardholderName"
      :label="$t('shared.payment.bank_card_form.cardholder_name_label')"
      :error-message="formErrors.cardholderName || errors.cardholderName"
      :is-readonly="isReadonly"
      :is-disabled="isDisabled"
      is-required
      @input="input"
    />

    <div class="flex flex-col sm:flex-row gap-x-6 gap-y-3">
      <VcInput
        v-mask="'## / ##'"
        v-model="expirationDate"
        :label="$t('shared.payment.bank_card_form.expiration_date_label')"
        :placeholder="$t('shared.payment.bank_card_form.expiration_date_placeholder')"
        :error-message="expirationDateErrors"
        :is-readonly="isReadonly"
        :is-disabled="isDisabled"
        name="expirationDate"
        autocomplete="off"
        minlength="7"
        maxlength="7"
        class="basis-1/4"
        is-required
        @input="input"
      />

      <VcInput
        v-mask="'####'"
        v-model="securityCode"
        :label="$t('shared.payment.bank_card_form.security_code_label')"
        :error-message="formErrors.securityCode || errors.securityCode"
        :is-readonly="isReadonly"
        :is-disabled="isDisabled"
        type="password"
        placeholder="111"
        name="securityCode"
        autocomplete="off"
        minlength="3"
        maxlength="4"
        class="basis-1/4"
        hide-password-switcher
        is-required
        @input="input"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, PropType, ref, watch } from "vue";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { clone } from "lodash";
import { BankCardErrorsType, BankCardType } from "@/shared/payment";
import { useI18n } from "vue-i18n";

const props = defineProps({
  isReadonly: Boolean,
  isDisabled: Boolean,

  modelValue: {
    type: Object as PropType<BankCardType>,
    required: true,
  },

  valid: {
    type: Boolean,
    default: false,
  },

  errors: {
    type: Object as PropType<BankCardErrorsType>,
    default: () => ({}),
  },
});

const emit = defineEmits<{
  (event: "update:modelValue", bankCardData: Partial<BankCardType>): void;
  (event: "update:valid", value: boolean): void;
}>();

const { t } = useI18n();

const initialValues = ref<BankCardType>(clone(props.modelValue));

const validationSchema = yup.object({
  number: yup.string().label(t("shared.payment.bank_card_form.number_label")).min(12).max(19).required(),
  cardholderName: yup.string().label(t("shared.payment.bank_card_form.cardholder_name_label")).max(64).required(),
  month: yup
    .string()
    .label(t("shared.payment.bank_card_form.month_label"))
    .matches(/^(0?[1-9]|1[012])$/, t("shared.payment.authorize_net.errors.month"))
    .length(2)
    .required(),
  year: yup
    .string()
    .label(t("shared.payment.bank_card_form.year_label"))
    .when("month", (valueMonth: string, schema) =>
      valueMonth.length > 1
        ? schema
            .test(
              "year",
              t("shared.payment.authorize_net.errors.expiration_date"),
              (valueYear: string) => Number(valueYear) >= Number(new Date().getFullYear().toString().slice(-2))
            )
            .length(2)
        : schema
    ),
  securityCode: yup.string().label(t("shared.payment.bank_card_form.security_code_label")).min(3).max(4).required(),
});
const { values, meta, errors: formErrors } = useForm<Partial<BankCardType>>({ validationSchema, initialValues });

const { value: number } = useField<string>("number");
const { value: cardholderName } = useField<string>("cardholderName");
const { value: month } = useField<string>("month");
const { value: year } = useField<string>("year");
const { value: securityCode } = useField<string>("securityCode");

const expirationDate = computed({
  get: () => (month.value.length > 1 || year.value ? `${month.value || "  "} / ${year.value}` : month.value),
  set(value: string) {
    const [rawMonth = "", rawYear = ""] = value.split(/\s*\/\s*/);
    month.value = rawMonth;
    year.value = rawYear;
  },
});

const expirationDateErrors = computed<string>(() =>
  [formErrors.value.month, formErrors.value.year, props.errors.month, props.errors.year].filter(Boolean).join(". ")
);

function input() {
  emit("update:modelValue", clone(values));
}

watch(
  () => props.modelValue,
  (value) => (initialValues.value = clone(value)),
  { deep: true }
);

watch(
  () => meta.value.valid,
  (value) => emit("update:valid", value),
  { immediate: true }
);
</script>