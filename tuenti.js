var fs = require('fs');
var rl = require('readline');
var stream = require('stream');

var Tuenti = (function(){

	function Tuenti(){};

	Tuenti.students = [];

	Tuenti.prototype.getStudents = function(callback){
		var self = this;
		var readStream = fs.createReadStream("students");
		var readInterface = rl.createInterface(readStream, new stream);
		var students = [];

		readInterface.on("line", function(line){

			var student = line.split(",");
			students.push({
				name: student[0],
				gender: student[1],
				age: student[2],
				studies: student[3],
				academic_year: student[4]
			});
			student = null;

		});

		readInterface.on("close", function(){
			self.students = students;
			if(callback) callback(students);
		});

	};

	Tuenti.prototype.searchStudent = function(student){
		var self = this;
		var foundStudentsName = [];

		for(var a = 0; a < self.students.length; a++){
			var searchStudent = self.students[a];
			if(searchStudent.gender 		== student.gender &&
				searchStudent.age 			== student.age &&
				searchStudent.studies 		== student.studies &&
				searchStudent.academic_year == student.academic_year){
				foundStudentsName.push(searchStudent.name);
			}
		}

		return foundStudentsName.sort(function(a,b){
			return a.localeCompare(b);
		});

	};

	Tuenti.MAX_INPUT = 100;


	return new Tuenti();

})();

var Helper = (function(){

	function Helper(){

		this.read = rl.createInterface({
		  input: process.stdin,
		  output: process.stdout,
		  terminal: true
		});

	};

	Helper.prototype = {

		MAX: 0,
		count: 0,

		stdin: function(options){
			var self = this;

			this.read.on('line', function(line){

				if(self.MAX == 0){
					self.MAX = (line > Tuenti.MAX_INPUT) ? Tuenti.MAX_INPUT : line;
				}else{
					if(options.line) options.line(line);
					if(self.count == self.MAX){
						self.read.close();
					}
				}
				self.count++;
			});

			this.read.on('close', options.close);

		}

	};

	return new Helper();

})();

Tuenti.getStudents(function(students){

	var allStudentsFound = [];

	Helper.stdin({

		line: function(line){
			
			var input = line.split(",");

			var student = {
				gender: input[0],
				age: input[1],
				studies: input[2],
				academic_year: input[3]
			}

			allStudentsFound.push(Tuenti.searchStudent(student));

		},

		close: function(){

			for(var a = 0; a < allStudentsFound.length; a++){

				var namesSting = allStudentsFound[a];
				if(namesSting.length <= 0) namesSting = "NONE";

				console.log("Case #"+(a + 1)+": " + namesSting);

			}

		}

	});

});

/*
Helper.getInput(function(numberTimes){

	Tuenti.getStudents(function(students){

		var allStudentsFound = [];

		numberTimes = (numberTimes > Tuenti.MAX_INPUT) ? Tuenti.MAX_INPUT : numberTimes;

		Helper.getNInputs(numberTimes, {

			onInputChange: function(input){

				var input = input.split(",");

				var student = {
					gender: input[0],
					age: input[1],
					studies: input[2],
					academic_year: input[3]
				}

				allStudentsFound.push(Tuenti.searchStudent(student));
			},

			onInputFinish: function(){

				console.log("Case #: ");

				for(var a = 0; a < allStudentsFound.length; a++){

					var namesSting = allStudentsFound[a];
					if(namesSting.length <= 0) namesSting = "NONE";

					console.log("Case #"+(a + 1)+": " + namesSting);

				}

			}

		});

	});

});
*/


