export type ResponseData = {
  code: number
  message: string
  ok: boolean
  data?: any
}

export interface Coupon {
  id?: number;
  couponName: string;
  couponType: 'CASH' | 'FULL_DISCOUNT';
  conditionAmount?: number;
  conditionNum?: number;
  activityId?: number;
  benefitAmount?: number;
  benefitDiscount?: number;
  rangeType: 'SPU' | 'TRADEMARK';
  limitNum?: number;
  takenCount?: number;
  startTime: string;
  endTime: string;
  createTime?: string;
  operateTime?: string;
  expireTime?: any;
  updateTime?: string;
  rangeDesc?: any;
  isGet?: any;
  rangeId?: any;
  couponTypeString?: string;
  rangeTypeString?: string;
  skuIdList?: number[];
  couponStatus?: any;
  reduceAmount?: any;
  isChecked?: number;
  isSelect?: number;
}

export interface CouponPageData {
  records: Coupon[];
  total: number;
  size: number;
  current: number;
  searchCount: boolean;
  pages: number;
}

export interface CouponPageResponseData extends ResponseData {
  data: CouponPageData;
}

export interface CouponRangeList {
  couponId: number;
  id?: number;
  rangeId: number;
  rangeType: string;
}

export interface CouponRule {
  benefitAmount?: number;
  benefitDiscount?: number;
  conditionAmount?: number;
  conditionNum?: number;
  couponId?: number;
  couponRangeList: CouponRangeList[];
  rangeDesc?: string;
  rangeType: 'SPU' | 'TRADEMARK';
}

export interface GetCouponRuleResponseData extends ResponseData {
  data: {
    spuInfoList: SpuInfo[]
    trademarkList: TrademarkInfo[]
  }
}

export interface SpuInfo {
	id?: number;
	createTime?: string;
	updateTime?: string;
	spuName: string;
	description: string;
	category3Id?: number;
	tmId?: number;
	spuSaleAttrList?: any;
	spuImageList?: any;
	spuPosterList?: any;
}

export interface TrademarkInfo {
	id?: number;
	createTime?: string;
	updateTime?: string;
	tmName: string;
	logoUrl: string;
}