// 测试 react 封分页＋表格显示数据

const fnSpace = function(){};

const page_url = 'http://www.baidu.com/aa/';


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



// 需要将 搜索 ／ 分页 公共区数据划到一块去

// 分页总和 组件
var PageModule = React.createClass({
	getInitialState: function(){
		return {
			"data": [],
			"pages": [],
			"current_page": null,
			"bAjaxStop": null,
			"oldUrl": '',
		}
	},
	setTableData: function(data){
		this.setState({data: data});
	},
	getCurrentInfo: function(){
		return {
			"pages": this.state.pages,
			"current_page": this.state.current_page
		}
	},
	getNewData: function(num, arr){
		this.setState({
			"current_page": num,
			"pages": arr,
			"bAjaxStop": true
		});
		var jqxhr = fnAjax(page_url + this.state.current_page);
		fnWhen(jqxhr, function(res, status, xhr){
			console.log("success!");
		}, function(xhr, errText, errStatus){
			var data = [
				{"name": "lee", "age": num},
				{"name": "peter", "age": num}
			];
			this.setState({"data": data});
		}.bind(this), function(){
			this.setState({
				"bAjaxStop": false,
			});
		}.bind(this));
	},
	searchNewData: function(searchTxt){
		this.setState({
			"current_page": 1,
			"bAjaxStop": true,
			'oldUrl': page_url+ "1" +"/"+searchTxt,
		});
		var jqxhr = fnAjax(page_url + this.state.current_page);
		fnWhen(jqxhr, function(res, status, xhr){
			console.log("success!");
		}, function(xhr, errText, errStatus){
			var data = [
				{"name": "lee", "age": num},
				{"name": "peter", "age": num}
			];
			this.setState({"data": data});
		}.bind(this), function(){
			this.setState({
				"bAjaxStop": false,
			});
		}.bind(this));
	},
	componentWillMount: function(){
		// 假设挂载之前发起ajax请求 获取了初始化的数据
		this.setState({
			"pages": [1,2,3,4,5,6,7],
			"current_page": 1,
			"bAjaxStop": false,
			"data": [
				{"name": "lee", "age": 12},
				{"name": "peter", "age": 14}
			],
		});
	},
	render: function(){
		return (
			<div>
				<SearchTextPage searchNewDataParent={this.searchNewData}></SearchTextPage>
				<TableDataShow data={this.state.data}></TableDataShow>
				<PageGroup 
					getCurrentInfoParent={this.getCurrentInfo}
				 	getNewDataParent={this.getNewData} >
				</PageGroup>
			</div>
		)
	}
});

// 搜索框
var SearchTextPage = React.createClass({
	handlerSearchClick: function(event){
		if(this.refs.mySearchInput.value){
			console.log("发起请求!");
		}
	},
	render: function(){
		return (
			<div>
				<input type='text' placeholder='请输入搜索内容' ref='mySearchInput' />
				<button onClick={this.handlerSearchClick}>搜索</button>
			</div>
		)
	}
});

// 表格显示
var TableDataShow = React.createClass({
	render: function(){
		return (
			<div>
				<table>
					<thead>
						<tr>
							<th>名称</th>
							<th>年龄</th>
						</tr>
					</thead>
					<tbody>
						{
							this.props.data.map(function(value){
								return (<tr>
									<td>{value.name}</td>
									<td>{value.age}</td>
								</tr>)
							})
						}
					</tbody>

				</table>
			</div>
		)
	}
});


// 分页组件
var PageGroup = React.createClass({
	handlerClickPageHref: function(event){
			let num = event.target.getAttribute("data-page");
		this.props.getNewDataParent(num, this.handlerChangePageNum(Number(num)));

	},
	handlerChangePageNum: function(num){
		if(num<=4){
			return [1,2,3,4,5,6,7];
		}else{
			return [num-3, num-2, num-1, num, num+1, num+2, num+3];
		}
	},
		
	render: function(){
		return (
			<div>
				{
					this.props.getCurrentInfoParent()['pages'].map(function(value){

						return <span data-page={value} onClick={this.handlerClickPageHref}>{value}   </span>

					}.bind(this))
				}
				<li>
					当前是{
						this.props.getCurrentInfoParent()['current_page']
					}页
				</li>
			</div>
		)
	}
});



ReactDOM.render(
	<PageModule />,
	document.getElementById("example")
);

ReactDOM.render(
	<PageModule />,
	document.getElementById("example2")
);





