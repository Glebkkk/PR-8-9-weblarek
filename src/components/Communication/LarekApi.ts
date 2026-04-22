import { IApi, IOrder, IOrderResult, IProductsResponse } from "../../types";

// Класс отвечает за получение данных о товарах с сервера и отправку заказа на сервер. 

export class LarekApi {

    private api: IApi;

    constructor(api: IApi) {
      this.api = api;
    }

    getProducts(): Promise<IProductsResponse> {
      return this.api.get<IProductsResponse>('/product/'); 
    }


    createOrder(order: IOrder): Promise<IOrderResult> {
      return this.api.post<IOrderResult>('/order/', order);
    }
}


