export default (ISOtime : string) => { 
    const toDT = (value: number) => {
        const sValue = value.toString()
        return sValue.length == 1 ? '0' + sValue : sValue
    }

    const date = new Date(ISOtime)
    const hours = toDT(date.getHours())
    const minutes = toDT(date.getMinutes())
    return `${hours}:${minutes}`
}