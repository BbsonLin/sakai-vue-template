const contextPath = import.meta.env.BASE_URL;

export default class ProductService {
    getProductsSmall() {
        return fetch(contextPath + 'demo/data/products-small.json')
            .then((res) => res.json())
            .then((d) => d.data)
    }

    getBestProducts() {
        return fetch(contextPath + 'demo/data/best-products.json')
            .then((res) => res.json())
            .then((d) => d.data)
    }
}
