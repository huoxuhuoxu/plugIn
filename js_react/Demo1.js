process.stdout.write('请输入:\r\n');
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(data){
	console.log(data);
	process.stdin.pause();
});




