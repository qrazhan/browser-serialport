var SerialPortLib = require('../index.js');
var SerialPort = SerialPortLib.SerialPort;

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

	var row = 0;
	var col = 0;
	var previous = document.getElementById("00");

	var output = document.getElementById("output");
	var movement = document.getElementById("movement");
	movement.value = parseInt(0);
	document.getElementById("settings").style.display = "none";

	var setCell = function() {
		var r = row.toString();
		var c = col.toString();
		console.log(r);
		console.log(c);
		console.log("====");
		console.log(r + c);
		var d = document.getElementById(r + c);
		console.log(d);
		previous = d;
		d.className = "success";
	};

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

	sp.on("data", function(data) {
		var command = data.toString();
		console.log(command);
		if (command == "u") {
			movement.value = parseInt(movement.value) + 1;
		} else if (command == "d") {
			movement.value = parseInt(movement.value) - 1;
		} else if (command == "s") {
			output.textContent += " ";
		} else if (command == "e") {
			var r = row.toString();
			var c = col.toString();

			output.textContent += document.getElementById(r + c).innerHTML;
			movement.value = parseInt(0);
		} else if (command == "h") {
			previous.className = "";

			col = parseInt(col) - parseInt(movement.value);
			if (col < 0) {
				col = 0;
			}

			setCell();
		} else if (command == "j") {
			previous.className = "";

			row = parseInt(row) + parseInt(movement.value);
			if (row > 4) {
				row = 4;
			}

			setCell();
		} else if (command == "k") {
			previous.className = "";

			row = parseInt(row) - parseInt(movement.value);
			if (row < 0) {
				row = 0;
			}

			setCell();
		} else if (command == "l") {
			previous.className = "";

			col = parseInt(col) + parseInt(movement.value);
			if (col > 5) {
				col = 5;
			}

			setCell();
		}
	});
}
