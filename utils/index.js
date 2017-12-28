/**
 *
 * @param func {Function}   实际要执行的函数
 * @param wait {Number}  延迟时间，单位是毫秒（ms）
 * @param wait {Boolean}  一定时间内，先执行／后执行
 * 
 * @return {Function}     返回一个“去抖”了的函数
 */

function debounce(func, wait, immediate) {
    // 设置定时器
    let timeout;
    return (...args) => {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        // 进入先清除定时器 
        claerTimeout(timeout);
        // 重新设置一个定时器，如果没有连续触发函数，就执行定时器，也是就是核心原理
        timeout = setTimeout(later, wait);
        if (callNow) 
            func.apply(this, args);
    }
};

module.exports = {
    debounce
}