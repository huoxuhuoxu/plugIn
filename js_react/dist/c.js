"use strict";

// 假设请求数据的接口
var url = "http://www.baidu.com?ajax=1&s=10";

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

// 分页组件
var PageModule = React.createClass({
	displayName: "PageModule",

	getInitialState: function getInitialState() {
		return {
			pageList: [],
			pageCurrent: 1,
			b_run: false,
			search_url: '',
			data: []
		};
	},
	getPageOption: function getPageOption() {
		return this.state;
	},
	setPageList: function setPageList(num, arr, sUrl, b) {

		if (this.state.b_run) {
			return '';
		}

		this.setState({
			pageList: arr,
			pageCurrent: num,
			b_run: true
		});
		if (sUrl) {
			this.setState({
				search_url: sUrl
			});
		}
		var new_url = sUrl || this.state.search_url ? sUrl || this.state.search_url : url;
		var ajax_url = new_url + "&p=" + num;
		var jqxhr = fnAjax(ajax_url, {}, "POST");
		fnWhen(jqxhr, function () {
			console.log('succ');
		}, function () {
			var data = [{ "name": "aa", "age": num }, { "name": "lee", "age": num }];
			this.setState({
				data: data
			});
		}.bind(this), function () {
			// 貌似没挂载都不能触发点击... 多余.
			if (this.isMounted()) {
				this.setState({
					b_run: false
				});
			}
		}.bind(this));
	},
	componentWillMount: function componentWillMount() {
		// 假设 后台返回 默认初始化为第十页，可能需要将分页计算拆进父组件
		this.setState({
			pageList: [1, 2, 3, 4, 5, 6, 7],
			data: [{ 'name': 'initial', 'age': 12 }]
		});
	},
	render: function render() {
		return React.createElement(
			"div",
			null,
			React.createElement(PageSearch, {
				setPageListParent: this.setPageList
			}),
			React.createElement(PageList, {
				setPageListParent: this.setPageList,
				getPageOptionParent: this.getPageOption,
				s: "7"
			}),
			React.createElement(PageData, {
				data: this.state.data
			})
		);
	}
});

// 分页部分
// 分页组生成部分，点击分页生成,搜索情况下根据后台返回生成
var PageList = React.createClass({
	displayName: "PageList",

	getInitialState: function getInitialState() {
		return {
			s: parseInt(this.props.s)
		};
	},
	getPageList: function getPageList(num) {
		var arr = [];
		var s = this.state.s;
		var c = Math.floor(s / 2);
		if (num <= c) {
			for (var i = 1; i <= s; i++) {
				arr.push(i);
			}
		} else {
			arr.push(num);
			for (var _i = 1; _i <= c; _i++) {
				arr.push(num + _i);
				arr.push(num - _i);
			}
		}
		arr.sort(function (n, n1) {
			return n - n1;
		});
		return arr;
	},
	clickPageHandler: function clickPageHandler(event) {
		var num = event.target.getAttribute("data-page");
		var arr = this.getPageList(Number(num));
		this.props.setPageListParent(num, arr);
	},
	render: function render() {
		return React.createElement(
			"div",
			null,
			this.props.getPageOptionParent()['pageList'].map(function (value, index) {
				if (index == 0) {
					return React.createElement(
						"span",
						{ "data-page": value, onClick: this.clickPageHandler },
						value
					);
				} else {
					return React.createElement(
						"span",
						{ "data-page": value, onClick: this.clickPageHandler },
						",",
						value
					);
				}
			}.bind(this)),
			React.createElement("br", null),
			React.createElement("br", null),
			React.createElement("br", null),
			React.createElement(
				"li",
				null,
				"当前是",
				this.props.getPageOptionParent()['pageCurrent'],
				"页!"
			)
		);
	}
});

// // 数据显示部分
var PageData = React.createClass({
	displayName: "PageData",

	render: function render() {
		return React.createElement(
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
				),
				this.props.data.map(function (value, index) {
					return React.createElement(
						"tr",
						null,
						React.createElement(
							"td",
							null,
							value['name']
						),
						React.createElement(
							"td",
							null,
							value['age']
						)
					);
				})
			)
		);
	}
});

// // 搜索部分
var PageSearch = React.createClass({
	displayName: "PageSearch",

	clickSearchHandler: function clickSearchHandler() {
		var txt = this.refs.inputSearch.value;
		var sUrl = url + "&title=" + txt;
		this.props.setPageListParent(1, [1, 2, 3, 4, 5, 6, 7], sUrl);
	},
	render: function render() {
		return React.createElement(
			"div",
			null,
			React.createElement("input", { type: "text", ref: "inputSearch" }),
			React.createElement(
				"button",
				{ type: "button", onClick: this.clickSearchHandler },
				"搜索"
			)
		);
	}
});

ReactDOM.render(React.createElement(PageModule, null), document.getElementById("page_module"), function () {
	console.log('挂载完成');
});
ReactDOM.render(React.createElement(PageModule, null), document.getElementById("page_module2"), function () {
	console.log('挂载完成');
});