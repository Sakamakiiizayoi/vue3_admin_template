<template>
    <ElCard class="box">
        <div style="font-size: medium; font-weight: 600;"><slot name="title">优惠规则</slot></div>
        <div class="des" v-if="activityRule.conditionAmount">条件金额：{{ activityRule.conditionAmount }}</div>
        <div class="des" v-if="activityRule.conditionNum">条件数量：{{ activityRule.conditionNum }}</div>
        <div class="des" v-if="activityRule.benefitAmount">优惠金额：{{ activityRule.benefitAmount }}</div>
        <div class="des" v-if="activityRule.benefitDiscount">优惠折扣：{{ activityRule.benefitDiscount }}</div>
        <div class="des" v-if="activityRule.benefitLevel">优惠等级：{{ activityRule.benefitLevel }}</div>
        <ElButton style="margin-top: 10px;" type="danger" icon="Delete" @click="deleteHandler">删除</ElButton>
    </ElCard>
</template>

<script setup lang="ts">
import type { ActivityRule } from '@/api/discount/activity/type';
defineProps<{
    activityRule: ActivityRule
}>()
const emit = defineEmits(['deleteRule'])
const deleteHandler = () => {
    emit('deleteRule')
}
</script>

<style scoped lang="scss">
.box {
    margin-bottom: 10px;

    .des {
        font-size: small;
        margin-top: 5px;
    }
}
</style>