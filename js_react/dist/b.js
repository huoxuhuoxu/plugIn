"use strict";

// 测试 react 封分页＋表格显示数据

var fnSpace = function fnSpace() {};

var page_url = 'http://www.baidu.com/aa/';

var fnAjax = function fnAjax(url) {
	var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "GET";

	return $.ajax({
		"url": url,
		"data": data,
		"type": type,
		"jsonp": "jsoncallback"
	});
};
var fnWhen = function fnWhen(jq) {
	var fnSucc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : fnSpace;
	var fnFail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : fnSpace;
	var fnAlways = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : fnSpace;

	jq.done(function (res, status, xhr) {
		fnSucc(res, status, xhr);
	}).fail(function (xhr, errText, errStatus) {
		fnFail(xhr, errText, errStatus);
	}).always(function (res, status, xhr) {
		fnAlways(res, status, xhr);
		console.log("complete!");
	});
};

// 需要将 搜索 ／ 分页 公共区数据划到一块去
// 分页总和 组件
var PageModule = React.createClass({
	displayName: "PageModule",

	getInitialState: function getInitialState() {
		return {
			"data": [],
			"pages": [],
			"current_page": null,
			"bAjaxStop": null,
			"oldUrl": ''
		};
	},
	setTableData: function setTableData(data) {
		this.setState({ data: data });
	},
	getCurrentInfo: function getCurrentInfo() {
		return {
			"pages": this.state.pages,
			"current_page": this.state.current_page
		};
	},
	getNewData: function getNewData(num, arr) {
		this.setState({
			"current_page": num,
			"pages": arr,
			"bAjaxStop": true
		});
		var jqxhr = fnAjax(page_url + this.state.current_page);
		fnWhen(jqxhr, function (res, status, xhr) {
			console.log("success!");
		}, function (xhr, errText, errStatus) {
			var data = [{ "name": "lee", "age": num }, { "name": "peter", "age": num }];
			this.setState({ "data": data });
		}.bind(this), function () {
			this.setState({
				"bAjaxStop": false
			});
		}.bind(this));
	},
	searchNewData: function searchNewData(searchTxt) {
		this.setState({
			"current_page": 1,
			"bAjaxStop": true,
			'oldUrl': page_url + "1" + "/" + searchTxt
		});
		var jqxhr = fnAjax(page_url + this.state.current_page);
		fnWhen(jqxhr, function (res, status, xhr) {
			console.log("success!");
		}, function (xhr, errText, errStatus) {
			var data = [{ "name": "lee", "age": num }, { "name": "peter", "age": num }];
			this.setState({ "data": data });
		}.bind(this), function () {
			this.setState({
				"bAjaxStop": false
			});
		}.bind(this));
	},
	componentWillMount: function componentWillMount() {
		// 假设挂载之前发起ajax请求 获取了初始化的数据
		this.setState({
			"pages": [1, 2, 3, 4, 5, 6, 7],
			"current_page": 1,
			"bAjaxStop": false,
			"data": [{ "name": "lee", "age": 12 }, { "name": "peter", "age": 14 }]
		});
	},
	render: function render() {
		return React.createElement(
			"div",
			null,
			React.createElement(SearchTextPage, { searchNewDataParent: this.searchNewData }),
			React.createElement(TableDataShow, { data: this.state.data }),
			React.createElement(PageGroup, {
				getCurrentInfoParent: this.getCurrentInfo,
				getNewDataParent: this.getNewData })
		);
	}
});

// 搜索框
var SearchTextPage = React.createClass({
	displayName: "SearchTextPage",
	handlerSearchClick: function handlerSearchClick(event) {
		if (this.refs.mySearchInput.value) {
			console.log("发起请求!");
		}
	},
	render: function render() {
		return React.createElement(
			"div",
			null,
			React.createElement("input", { type: "text", placeholder: "请输入搜索内容", ref: "mySearchInput" }),
			React.createElement(
				"button",
				{ onClick: this.handlerSearchClick },
				"搜索"
			)
		);
	}
});

// 表格显示
var TableDataShow = React.createClass({
	displayName: "TableDataShow",

	render: function render() {
		return React.createElement(
			"div",
			null,
			React.createElement(
				"table",
				null,
				React.createElement(
					"thead",
					null,
					React.createElement(
						"tr",
						null,
						React.createElement(
							"th",
							null,
							"名称"
						),
						React.createElement(
							"th",
							null,
							"年龄"
						)
					)
				),
				React.createElement(
					"tbody",
					null,
					this.props.data.map(function (value) {
						return React.createElement(
							"tr",
							null,
							React.createElement(
								"td",
								null,
								value.name
							),
							React.createElement(
								"td",
								null,
								value.age
							)
						);
					})
				)
			)
		);
	}
});

// 分页组件
var PageGroup = React.createClass({
	displayName: "PageGroup",

	handlerClickPageHref: function handlerClickPageHref(event) {


				var num = event.target.getAttribute("data-page");
		this.props.getNewDataParent(num, this.handlerChangePageNum(Number(num)));


	},
	handlerChangePageNum: function handlerChangePageNum(num) {
		if (num <= 4) {
			return [1, 2, 3, 4, 5, 6, 7];
		} else {
			return [num - 3, num - 2, num - 1, num, num + 1, num + 2, num + 3];
		}
	},

	render: function render() {
		return React.createElement(
			"div",
			null,
			this.props.getCurrentInfoParent()['pages'].map(function (value) {

				return React.createElement(
					"span",
					{ "data-page": value, onClick: this.handlerClickPageHref },
					value,
					"   "
				);
			}.bind(this)),
			React.createElement(
				"li",
				null,
				"当前是",
				this.props.getCurrentInfoParent()['current_page'],
				"页"
			)
		);
	}
});

ReactDOM.render(React.createElement(PageModule, null), document.getElementById("example"));

ReactDOM.render(React.createElement(PageModule, null), document.getElementById("example2"));