// 学习 react 基础

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('example')
);


var arr = ["aa", 'sss', 'dddd'];

ReactDOM.render(
	<div>
		{
			arr.map(function(value){
				return <li>{value}!</li>
			})
		}
	</div>,
	document.getElementById("example2")
);


var arr2 = [
	<span>这是测试A,</span>,
	<span>这是测试N</span>,
	<li>这是???</li>
];

ReactDOM.render(
	<div>{arr2}</div>,
	document.getElementById('example3')
);


var HelloMessage = React.createClass({
	render: function(){
		return <h1>Hello, {this.props.name}</h1>
	}
});

ReactDOM.render(
	<HelloMessage name="huoxu_huoxu" />,
	document.getElementById("example4")
);


var NotesList = React.createClass({
	render: function(){
		return (
			<ol>
				{
					React.Children.map(this.props.children, function(child){
						return <li>{child}</li>;
					})
				}
			</ol>
		)
	}
})


ReactDOM.render(
	<NotesList>
		<span>11</span>
		<span>22</span>
	</NotesList>,
	// document.body
	document.getElementById('example5')
);

// 目测 新版本getDefaultProps,propTypes,React.PropTypes 用处不大了
var MyTitle = React.createClass({
	getDefaultProps: function(){
		return {
			title: 'He'
		}
	},
	propTypes: {
		title: React.PropTypes.string.isRequired,
	},

	render: function(){
		return <h1>{this.props.title}</h1>
	}
})

var data = 123

ReactDOM.render(
	<MyTitle title={data} />,
	document.getElementById("example6")
)


// 如果需要操作真实dom 使用ref绑定,refs选择性操作
var MyComponent = React.createClass({
	handleClick: function(){
		this.refs.myTextInput.focus();
	},
	render: function(){
		return (
			<div>
				<input type="text" ref='myTextInput' />
				<input type="button" value="点击" onClick={this.handleClick} />
			</div>
		)
	}
});



// 只是操作 状态值 ，也就是数据部分，只需要 getInitialState:初始化对象,this.setState修改，绑定事件即可
ReactDOM.render(
	<MyComponent />,
	document.getElementById("example7")
);



var LikeButton = React.createClass({
	getInitialState: function(){
		return {liked: false};
	},
	handleClick: function(ev){
		this.setState({liked: !this.state.liked});
	},
	render: function(){
		var text = this.state.liked ? "like": "haven liked";
		return (
			<p onClick={this.handleClick}>
				You {text}!
			</p>
		)
	}
});


ReactDOM.render(
	<LikeButton />,
	document.getElementById("example8")
);


var Input = React.createClass({
	getInitialState: function(){
		return {"value": "Hello"};
	},
	handleChange: function(event){
		this.setState({value: event.target.value});
	},
	render: function(){
		var value = this.state.value;
		return (
			<div>
				<input type='text' value={value} onChange={this.handleChange} />
				<p>{value}</p>
			</div>
		)
	}
});


ReactDOM.render(
	<Input />,
	document.getElementById("example9")
)


var Hello = React.createClass({
	getInitialState: function(){
		return {
			opacity: 1.0
		};
	},
	componentDidMount: function(){
		this.timer = setInterval(function(){
			var opacity = this.state.opacity;
			opacity -= 0.05;
			if(opacity < 0.1){
				opacity = 1.0;
			}
			this.setState({
				opacity: opacity
			});
		}.bind(this), 100);
	},
	render: function(){
		return (
			<div style={{opacity: this.state.opacity}}>
				Hello,{this.props.name}
			</div>
		)
	}
});

ReactDOM.render(
	<Hello name='huoxu'/>,
	document.getElementById("example10")
);



var Usergist = React.createClass({
	getInitialState: function(){
		return {
			'result': '等待中' 
		};
	},
	componentDidMount: function(){
		var url = this.props.source;
		var promise = $.ajax({
			"url": url,
			"data": {"name":"aaa"},
			"type": "POST",
		});
		promise.fail(function(){
			if(this.isMounted()){
				setTimeout(function(){
					this.setState({
						"result": "失败"
					});
				}.bind(this), 2000);
			}
		}.bind(this));
	},
	render: function(){
		return <h1>目前是:{this.state.result}</h1>
	}
})


ReactDOM.render(
	<Usergist source="http://www.baidu.com/aaaa" />,
	document.getElementById("example11")
);



// 模拟分页react版

var PageModule = React.createClass({
	getInitialState: function(){
		return {
			"pages": [1,2,3,4,5,6,7],
			'current_page': 1
		}
	},
	handleClick: function(e){
		this.setState({"current_page": e.target.getAttribute('data-a')});
	},
	componentDidUpdate: function(nextProps, nextState){
		var a = this.state.current_page;
		var promise = $.ajax({
			"url": "http://www.baidu.com/" + a,
			"data": {"name":'cc'},
			"type": "POST",
			"jsonp": "jsoncallback"
		});
		promise.fail(function(){
			alert("失败");
		});
	},
	render: function(){
		return (
			<div>
				{
					this.state.pages.map(function(value, index){
						if(index == (this.state.pages.length-1)){
							return <span data-a={value} onClick={this.handleClick}>{value}</span>
						}else{
							return <span data-a={value} onClick={this.handleClick}>{value},</span>
						}
					}.bind(this))				
				}
				<li>{this.state.current_page}</li>
			</div>
		)
	}
});

ReactDOM.render(
	<PageModule />,
	document.getElementById('example12')
);












































