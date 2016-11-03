'use strict';

// 学习 react 基础

ReactDOM.render(React.createElement(
	'h1',
	null,
	'Hello, world!'
), document.getElementById('example'));

var arr = ["aa", 'sss', 'dddd'];

ReactDOM.render(React.createElement(
	'div',
	null,
	arr.map(function (value) {
		return React.createElement(
			'li',
			null,
			value,
			'!'
		);
	})
), document.getElementById("example2"));

var arr2 = [React.createElement(
	'span',
	null,
	'这是测试A,'
), React.createElement(
	'span',
	null,
	'这是测试N'
), React.createElement(
	'li',
	null,
	'这是???'
)];

ReactDOM.render(React.createElement(
	'div',
	null,
	arr2
), document.getElementById('example3'));

var HelloMessage = React.createClass({
	displayName: 'HelloMessage',

	render: function render() {
		return React.createElement(
			'h1',
			null,
			'Hello, ',
			this.props.name
		);
	}
});

ReactDOM.render(React.createElement(HelloMessage, { name: 'huoxu_huoxu' }), document.getElementById("example4"));

var NotesList = React.createClass({
	displayName: 'NotesList',

	render: function render() {
		return React.createElement(
			'ol',
			null,
			React.Children.map(this.props.children, function (child) {
				return React.createElement(
					'li',
					null,
					child
				);
			})
		);
	}
});

ReactDOM.render(React.createElement(
	NotesList,
	null,
	React.createElement(
		'span',
		null,
		'11'
	),
	React.createElement(
		'span',
		null,
		'22'
	)
),
// document.body
document.getElementById('example5'));

// 目测 新版本getDefaultProps,propTypes,React.PropTypes 用处不大了
var MyTitle = React.createClass({
	displayName: 'MyTitle',

	getDefaultProps: function getDefaultProps() {
		return {
			title: 'He'
		};
	},
	propTypes: {
		title: React.PropTypes.string.isRequired
	},

	render: function render() {
		return React.createElement(
			'h1',
			null,
			this.props.title
		);
	}
});

var data = 123;

ReactDOM.render(React.createElement(MyTitle, { title: data }), document.getElementById("example6"));

// 如果需要操作真实dom 使用ref绑定,refs选择性操作
var MyComponent = React.createClass({
	displayName: 'MyComponent',

	handleClick: function handleClick() {
		this.refs.myTextInput.focus();
	},
	render: function render() {
		return React.createElement(
			'div',
			null,
			React.createElement('input', { type: 'text', ref: 'myTextInput' }),
			React.createElement('input', { type: 'button', value: '点击', onClick: this.handleClick })
		);
	}
});

// 只是操作 状态值 ，也就是数据部分，只需要 getInitialState:初始化对象,this.setState修改，绑定事件即可
ReactDOM.render(React.createElement(MyComponent, null), document.getElementById("example7"));

var LikeButton = React.createClass({
	displayName: 'LikeButton',

	getInitialState: function getInitialState() {
		return { liked: false };
	},
	handleClick: function handleClick(ev) {
		this.setState({ liked: !this.state.liked });
	},
	render: function render() {
		var text = this.state.liked ? "like" : "haven liked";
		return React.createElement(
			'p',
			{ onClick: this.handleClick },
			'You ',
			text,
			'!'
		);
	}
});

ReactDOM.render(React.createElement(LikeButton, null), document.getElementById("example8"));

var Input = React.createClass({
	displayName: 'Input',

	getInitialState: function getInitialState() {
		return { "value": "Hello" };
	},
	handleChange: function handleChange(event) {
		this.setState({ value: event.target.value });
	},
	render: function render() {
		var value = this.state.value;
		return React.createElement(
			'div',
			null,
			React.createElement('input', { type: 'text', value: value, onChange: this.handleChange }),
			React.createElement(
				'p',
				null,
				value
			)
		);
	}
});

ReactDOM.render(React.createElement(Input, null), document.getElementById("example9"));

var Hello = React.createClass({
	displayName: 'Hello',

	getInitialState: function getInitialState() {
		return {
			opacity: 1.0
		};
	},
	componentDidMount: function componentDidMount() {
		this.timer = setInterval(function () {
			var opacity = this.state.opacity;
			opacity -= 0.05;
			if (opacity < 0.1) {
				opacity = 1.0;
			}
			this.setState({
				opacity: opacity
			});
		}.bind(this), 100);
	},
	render: function render() {
		return React.createElement(
			'div',
			{ style: { opacity: this.state.opacity } },
			'Hello,',
			this.props.name
		);
	}
});

ReactDOM.render(React.createElement(Hello, { name: 'huoxu' }), document.getElementById("example10"));

var Usergist = React.createClass({
	displayName: 'Usergist',

	getInitialState: function getInitialState() {
		return {
			'result': '等待中'
		};
	},
	componentDidMount: function componentDidMount() {
		var url = this.props.source;
		var promise = $.ajax({
			"url": url,
			"data": { "name": "aaa" },
			"type": "POST"
		});
		promise.fail(function () {
			if (this.isMounted()) {
				setTimeout(function () {
					this.setState({
						"result": "失败"
					});
				}.bind(this), 2000);
			}
		}.bind(this));
	},
	render: function render() {
		return React.createElement(
			'h1',
			null,
			'目前是:',
			this.state.result
		);
	}
});

ReactDOM.render(React.createElement(Usergist, { source: 'http://www.baidu.com/aaaa' }), document.getElementById("example11"));

// 模拟分页react版

var PageModule = React.createClass({
	displayName: 'PageModule',

	getInitialState: function getInitialState() {
		return {
			"pages": [1, 2, 3, 4, 5, 6, 7],
			'current_page': 1
		};
	},
	handleClick: function handleClick(e) {
		this.setState({ "current_page": e.target.getAttribute('data-a') });
	},
	componentDidUpdate: function componentDidUpdate(nextProps, nextState) {
		var a = this.state.current_page;
		var promise = $.ajax({
			"url": "http://www.baidu.com/" + a,
			"data": { "name": 'cc' },
			"type": "POST",
			"jsonp": "jsoncallback"
		});
		promise.fail(function () {
			alert("失败");
		});
	},
	render: function render() {
		return React.createElement(
			'div',
			null,
			this.state.pages.map(function (value, index) {
				if (index == this.state.pages.length - 1) {
					return React.createElement(
						'span',
						{ 'data-a': value, onClick: this.handleClick },
						value
					);
				} else {
					return React.createElement(
						'span',
						{ 'data-a': value, onClick: this.handleClick },
						value,
						','
					);
				}
			}.bind(this)),
			React.createElement(
				'li',
				null,
				this.state.current_page
			)
		);
	}
});

ReactDOM.render(React.createElement(PageModule, null), document.getElementById('example12'));