<template>
    <div class="h-372 mt-24p flex flex-col items-center justify-center">
        <img class="logo mx-auto w-120 h-120" src="../../images/import-success.svg" alt="img" />
        <div class="text-left">
            <p class="text-16 font-bold mb-10p">
                {{ $t('contact.contact_import_modal_review_title') }}
            </p>
            <ul class="text-14">
                <li
                    class="mb-16p"
                    v-html="
                        $t(`contact.contact_import_modal_review_line_1_${rowQuantity > 1 ? 'rows' : 'row'}`, {
                            row_quantity: filters.formatNumberWithCommas(rowQuantity),
                        })
                    "
                ></li>
                <li
                    v-html="$t('contact.contact_import_modal_review_line_2', { attribute_quantity: attrQuantity })"
                ></li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import filters from '@/utils/filters';

export default defineComponent({
    name: 'ContactListModalImportContactReview',
    props: {
        rowQuantity: {
            type: Number,
            default: 0,
        },
        attrQuantity: {
            type: Number,
            default: 0,
        },
    },
    components: {},
    setup() {
        return {
            filters,
        };
    },
});
</script>

<style lang="scss" scoped>
ul {
    li {
        position: relative;
        padding-left: 20px;
        &:before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #000000;
        }
    }
}
</style>
