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





var PageModule = React.createClass({
	getInitialState: function(){
		return {
			"data": [
				{"name": "lee", "age": 12},
				{"name": "peter", "age": 14}
			],
		}
	},
	setTableData: function(data){
		this.setState({data: data});
	},
	render: function(){
		return (
			<div>
				<TableDataShow data={this.state.data}></TableDataShow>
				<PageGroup callbackParent={this.setTableData}></PageGroup>
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
// 干掉 生命周期,严重影响了状态的判定
var PageGroup = React.createClass({
	getInitialState: function(){
		return {
			"pages": [1,2,3,4,5,6,7],
			"current_page": 1,
			"bAjaxStop": false,
		}
	},
	handlerClickPageHref: function(event){
		if(!this.state.bAjaxStop){
			let num = event.target.getAttribute("data-page");
			this.setState({
				current_page: num,
				pages: this.handlerChangePageNum(Number(num)),
				"bAjaxStop": true,
			});

			var jqxhr = fnAjax(page_url + this.state.current_page);
			fnWhen(jqxhr, function(res, status, xhr){
				console.log("success!");
			}, function(xhr, errText, errStatus){
				var data = [
					{"name": "lee", "age": num},
					{"name": "peter", "age": num}
				];
				this.props.callbackParent(data);
			}.bind(this), function(){
				this.setState({
					"bAjaxStop": false,
				});
			}.bind(this));
		}
	},
	handlerChangePageNum: function(num){
		if(num<=4){
			return [1,2,3,4,5,6,7];
		}else{
			return [num-3, num-2, num-1, num, num+1, num+2, num+3];
		}
	},
	// componentDidUpdate: function(nextProps, nextState){
		
	// },
	render: function(){
		return (
			<div>
				{
					this.state.pages.map(function(value){

						return <span data-page={value} onClick={this.handlerClickPageHref}>{value}   </span>

					}.bind(this))
				}
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





