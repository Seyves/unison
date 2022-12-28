export default (duration: number) => {
    let timeout: ReturnType<typeof setTimeout>
    return (callback: (...args: any[]) => any) => {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(callback, duration)
    }
}