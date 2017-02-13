// 基础函数支持,底库


// 针对 redux->applyMiddleware 中间件处理异步事件的重写
// 有必要 情况下 抽离 async的实现,改为配置,'async','logger'...,根据传入的参数实现,存储器dispatch的功能
const STORE_DISPATCH = (STORE) => {
	const NEXT = STORE.dispatch;
	return async function(action){
		if(action.async && (action.async instanceof Promise)){
			action.before ? NEXT(action.before()) : null;
			await new Promise(function(resolve){
				action.async.then(function(data){
					action = Object.assign({}, action, {'async': data});
					resolve(action);
				}, function(err){
					action = action.fail ? Object.assign({}, action, action.fail()) : Object.assign({}, action);
					resolve(action);
				}).catch(function(err){
					throw new Error("Error:" + err.toString());
				});
			});
		}
		NEXT(action);
	}
}


export var writeOverDispatch = STORE_DISPATCH;

