

// 假设请求数据的接口
const url = "http://www.baidu.com?ajax=1&s=10"



var fnAjax = function(url, data = {}, type = "GET"){
	return $.ajax({
		"url": url,
		"data": data,
		"type": type,
		"jsonp": "jsoncallback", 
	});
}
var fnWhen = function(jq, fnSucc = fnSpace, fnFail = fnSpace, fnAlways = fnSpace){
	jq.done(function(res, status, xhr){
		fnSucc(res, status, xhr);
	}).fail(function(xhr, errText, errStatus){
		fnFail(xhr, errText, errStatus);
	}).always(function(res, status, xhr){
		fnAlways(res, status, xhr);
		console.log("complete!");
	});	
}

// 分页组件
var PageModule = React.createClass({
	getInitialState: function(){
		return {
			pageList: [],
			pageCurrent: 1,
			b_run: false,
			search_url: '',
			data: [],
		}
	},
	getPageOption: function(){
		return this.state
	},
	setPageList: function(num, arr, sUrl, b){

		if(this.state.b_run){
			return '';
		}

		this.setState({
			pageList: arr,
			pageCurrent: num,
			b_run: true,
		});
		if(sUrl){
			this.setState({
				search_url: sUrl
			});
		}
		let new_url = (sUrl || this.state.search_url) ? sUrl || this.state.search_url : url;
		let ajax_url = (new_url + "&p=" + num);
		let jqxhr = fnAjax(ajax_url, {},"POST");
		fnWhen(jqxhr, function(){
			console.log('succ');
		}, function(){
			let data = [
				{"name": "aa", "age": num},
				{"name": "lee", "age": num}
			];
			this.setState({
				data: data
			});
		}.bind(this), function(){
			// 貌似没挂载都不能触发点击... 多余.
			if(this.isMounted()){
				this.setState({
					b_run: false
				});
			}
		}.bind(this));
	},	
	componentWillMount: function(){
		// 假设 后台返回 默认初始化为第十页，可能需要将分页计算拆进父组件
		this.setState({
			pageList: [1,2,3,4,5,6,7],
			data: [{'name': 'initial', 'age': 12}]
		});
	},
	render: function(){
		return (
			<div>
				<PageSearch  
						setPageListParent={this.setPageList} 
				/>
				<PageList 
						setPageListParent={this.setPageList} 
						getPageOptionParent={this.getPageOption}
						s="7" 
				/>
				<PageData 
						data={this.state.data}
				/>
			</div>
		)
	}
});

// 分页部分
// 分页组生成部分，点击分页生成,搜索情况下根据后台返回生成
var PageList = React.createClass({
	getInitialState: function(){
		return {
			s: parseInt(this.props.s),
		}
	},
	getPageList: function(num){
		let arr = [];
		let s = this.state.s;
		let c = Math.floor(s/2);
		if(num <= c){
			for(let i=1; i<=s; i++){
				arr.push(i);
			}
		}else{
			arr.push(num);
			for(let i=1; i<=c; i++){
				arr.push(num+i);
				arr.push(num-i);
			}
		}
		arr.sort(function(n ,n1){
			return n - n1;
		});
		return arr;
	},
	clickPageHandler: function(event){
		let num = event.target.getAttribute("data-page");
		let arr = this.getPageList(Number(num));
		this.props.setPageListParent(num, arr);
	},
	render: function(){
		return (
			<div>
				{
					this.props.getPageOptionParent()['pageList'].map(function(value, index){
						if(index==0){
							return <span data-page={value} onClick={this.clickPageHandler}>{value}</span>;
						}else{
							return <span data-page={value} onClick={this.clickPageHandler}>,{value}</span>;
						}
					}.bind(this))
				}
				<br />
				<br />
				<br />
				<li>
					当前是{this.props.getPageOptionParent()['pageCurrent']}页!
				</li>
			</div>
		)
	}
});

// // 数据显示部分
var PageData = React.createClass({
	render: function(){
		return (
			<table>
				<thead>
					<tr>
						<th>名称</th>
						<th>年龄</th>
					</tr>
					{
						this.props.data.map(function(value, index){
							return <tr>
								<td>
									{value['name']}
								</td>
								<td>
									{value['age']}
								</td>
							</tr>
						})
					}
				</thead>
			</table>
		)
	}
});

// // 搜索部分
var PageSearch = React.createClass({
	clickSearchHandler: function(){
		let txt = this.refs.inputSearch.value;
		let sUrl = (url + "&title="+txt);
		this.props.setPageListParent(1, [1,2,3,4,5,6,7], sUrl);
	},
	render: function(){
		return (
			<div>
				<input type='text' ref='inputSearch' />
				<button type='button' onClick={this.clickSearchHandler}>搜索</button>
			</div>
		)
	}
});





ReactDOM.render(
	<PageModule />,
	document.getElementById("page_module"),
	function(){console.log('挂载完成')}
);
ReactDOM.render(
	<PageModule />,
	document.getElementById("page_module2"),
	function(){console.log('挂载完成')}
);


