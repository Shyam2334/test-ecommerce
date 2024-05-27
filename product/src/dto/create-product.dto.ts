interface CreateProductDto {
    name: string,
    company: string,
    price: number,
    desc: string,
    quantity?: number
}

export default CreateProductDto;