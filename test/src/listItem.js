import React, { Component } from 'react';

export default class ListItem extends Component {
  render() {
    let { 
      activityId,//权益id
      icItemId,//商品id,仅神商品返回
      mainPic,//主图
      name,//名称
      openSubTitle,//副标题
      benefitDetail,//详情描述
      activityDesc,//详情页介绍，神权益对应权益使用地址，神商品对应商品购买方式
      openPromotionScope,//神商品or神权益
      openEnergy,//消耗能量豆
      openSellerId,//卖家id
      openUseStart,//开始时间
      openUseEnd,//结束时间
      inventory,//剩余库存，总库存需要加soldQuantity
      soldQuantity,//已抢多少件
      openPromotion,//优惠价
      openVideo,//视频链接
      openVideoTip,//视频上提示图片
      openOriginPrice,//原价
      benefitItemId,//
      openBenefitLink = window.configData.benefitDetailLink,//查看权益链接
      openShopName,//店铺名称
      openItemType,//商品标签id
      openShopLogo,//店铺LOGO
      isPlay = false,
      type,//list or detail
      pageSource,//页面来源
    } = this.props;
    let sellout = inventory <= 0;
    return <div className="video-content">
      <div className="on-video">
        { sellout ? <p className="tip">已兑换光</p> : null}
      </div>
      <div className="base-info" data-spm="dgobenefitDetail">
        <p className="name">{name}</p>
        <p className="sub-name">{openSubTitle}</p>
      </div>
    </div>
  }
}