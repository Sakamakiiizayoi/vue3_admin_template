<template>
  <div class="dataVisualize-box">
    <div class="card top-box">
      <div class="top-title">数据可视化</div>
      <el-tabs v-model="tabActive" class="demo-tabs">
        <el-tab-pane v-for="item in tab" :key="item.name" :label="item.label" :name="item.name"></el-tab-pane>
      </el-tabs>
      <div class="top-content">
        <el-row :gutter="40">
          <el-col class="mb40" :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <div class="item-left sle">
              <span class="left-title">访问总数</span>
              <div class="img-box">
                <img src="./images/book-sum.png" alt="" />
              </div>
              <span class="left-number">848.132w</span>
            </div>
          </el-col>
          <el-col class="mb40" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-center">
              <div class="gitee-traffic traffic-box">
                <div class="traffic-img">
                  <img src="./images/add_person.png" alt="" />
                </div>
                <span class="item-value">{{ userNum || '...' }}</span>
                <span class="traffic-name sle">用户数量</span>
              </div>
              <div class="gitHub-traffic traffic-box">
                <div class="traffic-img">
                  <img src="./images/trademark.png" alt="" />
                </div>
                <span class="item-value">{{ trademarkNum || '...' }}</span>
                <span class="traffic-name sle">品牌数量</span>
              </div>
              <div class="today-traffic traffic-box">
                <div class="traffic-img">
                  <img src="./images/SKU.png" alt="" />
                </div>
                <span class="item-value">{{ skuNum || '...' }}</span>
                <span class="traffic-name sle">SKU数量</span>
              </div>
              <div class="yesterday-traffic traffic-box">
                <div class="traffic-img">
                  <img src="./images/book_sum.png" alt="" />
                </div>
                <span class="item-value">{{ orderNum || '...' }}</span>
                <span class="traffic-name sle">订单数量</span>
              </div>
            </div>
          </el-col>
          <el-col class="mb40" :xs="24" :sm="24" :md="24" :lg="10" :xl="10">
            <div class="item-right">
              <div class="echarts-title">订单 / 退款 占比</div>
              <div class="book-echarts">
                <Pie :data="pieData" v-if="pieData.length > 0" ref="pieRef" />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="card bottom-box">
      <div class="bottom-title">数据来源</div>
      <div class="bottom-tabs">
        <el-tabs v-model="tabActive" class="demo-tabs">
          <el-tab-pane v-for="item in tab" :key="item.name" :label="item.label" :name="item.name"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="curve-echarts">
        <Curve ref="curveRef" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="dataVisualize">
import { ref, onMounted } from "vue";
import Pie from "./components/pie.vue";
import Curve from "./components/curve.vue";
import { reqOrderPage } from '@/api/order/orderList';
import { reqRefundPage } from '@/api/order/refund';
import { reqUserPage } from '@/api/clientUser';
import { reqSkuList } from '@/api/product/sku';
import { reqHasTrademark } from '@/api/product/trademark';

const tabActive = ref(1);
const pieRef = ref();
const curveRef = ref();

//#region 载入相关数据
const pieData = ref<{ value: number, name: string }[]>([]);
const userNum = ref(0)
const skuNum = ref(0)
const trademarkNum = ref(0)
const orderNum = ref(0)
const refundNum = ref(0)
/**
 * 返回订单数量和退单数量
 */
const getOrderData = async () => {
  let order = reqOrderPage(1, 1, '')
  let refund = reqRefundPage(1, 1)
  let results = await Promise.all([order, refund])
  return [results[0].data.total, results[1].data.total]
}

const getSomeData = async () => {
  let userResult = reqUserPage(1, 1, '')
  let skuResult = reqSkuList(1, 1)
  let trademarkResult = reqHasTrademark(1, 1)
  let all = await Promise.all([userResult, skuResult, trademarkResult])
  return [all[0].data.total, all[1].data.total, all[2].data.total]
}
//#endregion

onMounted(async () => {
  curveRef.value.initChart(curveData);
  [orderNum.value, refundNum.value] = await getOrderData();
  pieData.value = [
    { value: orderNum.value, name: "订单量" },
    { value: refundNum.value, name: "退款量" }
  ];
  [userNum.value, skuNum.value, trademarkNum.value] = await getSomeData();
});

const tab = [
  { label: "未来7日", name: 1 },
  { label: "近七日", name: 2 },
  { label: "近一月", name: 3 },
  { label: "近三月", name: 4 },
  { label: "近半年", name: 5 },
  { label: "近一年", name: 6 }
];

const curveData = [
  { value: 30, spotName: "淘宝" },
  { value: 90, spotName: "天猫" },
  { value: 10, spotName: "拼多多" },
  { value: 70, spotName: "咸鱼" },
  { value: 20, spotName: "转转" },
];
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
