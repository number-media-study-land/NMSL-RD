function pv(ctx) {
    console.log('ctx')
}

module.exports = function() {
    return async function(ctx, next) {
        pv(ctx)
        await next();
    }
}