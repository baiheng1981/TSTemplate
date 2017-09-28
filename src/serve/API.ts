class API {
    "use strict";

    apiOrders_get:string           = "/api/orders";              //我的订单
    apiAftersales_get:string       = "/api/aftersales";          //我的订单售后
    apiOrder_get:string            = "/api/order";               //订单详情
    apiOrder_patch:string          = "/api/order";               //取消订单、确认收货
    apiOrder_delete:string         = "/api/order";               //删除订单

}

export default new API();