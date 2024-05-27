interface Order {
    id?: string,
    product: {
        name: string,
        desc: string,
        price: number,
        company: string
    }
    userId: string
}

export default Order;
