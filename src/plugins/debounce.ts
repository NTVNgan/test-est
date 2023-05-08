export default function (func: Function, timeout = 300) {
    let timer: any;
    return (...args: any) => {
        if (!timer) {
            func.apply(this, args);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = undefined;
        }, timeout);
    };
}