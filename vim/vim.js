var SerialPortLib = require('../index.js');
var SerialPort = SerialPortLib.SerialPort;

var array1 = ['A', 'F', 'K', 'P', 'U', 'Z'];
var array5 = ['B', 'G', 'L', 'Q', 'V', '.'];
var array2 = ['C', 'H', 'M', 'R', 'W', '!'];
var array4 = ['D', 'I', 'N', 'S', 'X', '?'];
var array3 = ['E', 'J', 'O', 'T', 'Y', '@'];

var index = -1;

SerialPortLib.list(function(err, ports) {
	var portsPath = document.getElementById("portPath");

	if (err) {
		console.log("Error listing ports", err);
		portsPath.options[0] = new Option(err, "ERROR:" + err);
		portsPath.options[0].selected = true;
		return;
	} else {
		for (var i = 0; i < ports.length; i++) {
			portsPath.options[i] = new Option(ports[i].comName, ports[i].comName);

			if (ports[i].comName.toLowerCase().indexOf("usb") !== -1) {
				portsPath.options[i].selected = true;
			}
		}

		var connectButton = document.getElementById("connect");
		connectButton.onclick = function() {
			var port = portsPath.options[portsPath.selectedIndex].value;
			var baudrateElement = document.getElementById("baudrate");
			var baudrate = baudrateElement.options[baudrateElement.selectedIndex].value;
			connect(port, baudrate);
		};
	}
});

function connect(port, baudrate) {
	var baud = 9600;
	if (baudrate) {
		baud = baudrate;
	}

	var sp = new SerialPort(port, {
	    baudrate: baud,
	    buffersize: 1
	}, true);

	var output = document.getElementById("output");
	document.getElementById("settings").style.display = "none";

	sp.on("open", function() {
		document.getElementById("connected-container").style.display = "block";
		output.textContent += "Connection open\n";
		setTimeout(function() {
			output.textContent = "";
		}, 1000);
	});

	sp.on("error", function(string) {
		output.textContent += "\nError: " + string + "\n";
	});

	var clearSelection = function(){
		for(var i =1; i<7; i++){
			var e = document.getElementById("big"+i);
			e.className = "big-menu-item";	
		}
	};

	var atime = new Date().getTime();
	var btime= new Date().getTime();
	var ctime= new Date().getTime();
	var dtime= new Date().getTime();
	var etime= new Date().getTime();
	var ftime= new Date().getTime();

	sp.on("data", function(data) {
		var command = data.toString();
		console.log(command);
		if(command == "1" || command == "2" || command == "3" || command == "4" || command == "5" || command == "6"){
			index = parseInt(command);
			clearSelection();
			switch(index){
				case 1: 
					var e = document.getElementById("big1");
					e.className = e.className + " menu_selected";
					break;
				case 2: 
					var e = document.getElementById("big3");
					e.className = e.className + " menu_selected";
					break;
				case 3: 
					var e = document.getElementById("big5");
					e.className = e.className + " menu_selected";
					break;
				case 4: 
					var e = document.getElementById("big6");
					e.className = e.className + " menu_selected";
					break;
				case 5: 
					var e = document.getElementById("big4");
					e.className = e.className + " menu_selected";
					break;
				case 6: 
					var e = document.getElementById("big2");
					e.className = e.className + " menu_selected";
					break;					
			}
			index -= 1;
		} else if(command == "0"){
			index = -1;
			clearSelection();
		} else if(command == "a" || command == "b" || command == "c" || command == "d" || command == "e" || command == "f"){
			if(index == -1){
				output.textContent += " ";
			} else {
				var time = new Date().getTime();
				switch(command){
					case "a": if(time-atime > 150) {output.textContent += array1[index];atime = time;} break;
					case "b": if(time-btime > 150) {output.textContent += array2[index];btime = time;} break;
					case "c": if(time-ctime > 150) {output.textContent += array3[index];ctime = time;} break;
					case "d": if(time-dtime > 150) {output.textContent += array4[index];dtime = time;} break;
					case "e": if(time-etime > 150) {output.textContent += array5[index];etime = time;} break;
					case "f": if(time-ftime > 150) {output.textContent += " ";ftime = time;} break;
				}
			}
		}
	});
}
