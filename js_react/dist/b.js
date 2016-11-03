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

var PageModule = React.createClass({
	displayName: "PageModule",

	getInitialState: function getInitialState() {
		return {
			"data": [{ "name": "lee", "age": 12 }, { "name": "peter", "age": 14 }]
		};
	},
	setTableData: function setTableData(data) {
		this.setState({ data: data });
	},
	render: function render() {
		return React.createElement(
			"div",
			null,
			React.createElement(TableDataShow, { data: this.state.data }),
			React.createElement(PageGroup, { callbackParent: this.setTableData })
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
// 干掉 生命周期,严重影响了状态的判定
var PageGroup = React.createClass({
	displayName: "PageGroup",

	getInitialState: function getInitialState() {
		return {
			"pages": [1, 2, 3, 4, 5, 6, 7],
			"current_page": 1,
			"bAjaxStop": false
		};
	},
	handlerClickPageHref: function handlerClickPageHref(event) {
		var _this = this;

		if (!this.state.bAjaxStop) {
			var jqxhr;

			(function () {
				var num = event.target.getAttribute("data-page");
				_this.setState({
					current_page: num,
					pages: _this.handlerChangePageNum(Number(num)),
					"bAjaxStop": true
				});

				jqxhr = fnAjax(page_url + _this.state.current_page);

				fnWhen(jqxhr, function (res, status, xhr) {
					console.log("success!");
				}, function (xhr, errText, errStatus) {
					var data = [{ "name": "lee", "age": num }, { "name": "peter", "age": num }];
					this.props.callbackParent(data);
				}.bind(_this), function () {
					this.setState({
						"bAjaxStop": false
					});
				}.bind(_this));
			})();
		}
	},
	handlerChangePageNum: function handlerChangePageNum(num) {
		if (num <= 4) {
			return [1, 2, 3, 4, 5, 6, 7];
		} else {
			return [num - 3, num - 2, num - 1, num, num + 1, num + 2, num + 3];
		}
	},
	// componentDidUpdate: function(nextProps, nextState){

	// },
	render: function render() {
		return React.createElement(
			"div",
			null,
			this.state.pages.map(function (value) {

				return React.createElement(
					"span",
					{ "data-page": value, onClick: this.handlerClickPageHref },
					value,
					"   "
				);
			}.bind(this))
		);
	}
});

ReactDOM.render(React.createElement(PageModule, null), document.getElementById("example"));

ReactDOM.render(React.createElement(PageModule, null), document.getElementById("example2"));