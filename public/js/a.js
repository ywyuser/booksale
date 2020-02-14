process.nextTick(function(args) {
    console.log("nextTick延迟执行！");
});
setImmediate(function(args) {
    console.log("setImmediate延迟执行！");
});
console.log("正常执行！");