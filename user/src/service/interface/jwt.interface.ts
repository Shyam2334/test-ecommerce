interface IJwt {
    sign(payload: object): string,
}

export default IJwt;