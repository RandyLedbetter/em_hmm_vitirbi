var EM_Virtibi = Backbone.Model.extend({
	defaults: {
		F_B: 0.5,
		F_L: 0.5,
		Pe1_n: 0.0,
		B_B: 0.6,
		B_L: 0.3,
		L_L: 0.7,
		L_B: 0.4,
		H_B: 0.5,
		T_B: 0.5,
		H_L: 0.1,
		T_L: 0.9,
		generated_B_B: 0.6,
		generated_B_L: 0.3,
		generated_L_L: 0.7,
		generated_L_B: 0.4,
		generated_H_B: 0.5,
		generated_T_B: 0.5,
		generated_H_L: 0.1,
		generated_T_L: 0.9,
		n: 0,
		t: 0,
		size: 0,
		fileInputError: false,
		backProbs: null,
		forwardProbs: null,
		observationSequence: [],
		generatedStateSequence: [],
		generatedObservationSequence: [],
		stateSequence: [],
		specificity: 0.0,
		sensitivity: 0.0,
		tn: 0,
		tp: 0,
		fn: 0,
		fp: 0,
		accuracy: 0.0,
		fpr: 0.0
	},

	forwardAlgorithm: function() {
		
		var transProbs = [[this.get("F_B")], [this.get("F_L")]];
		var i = null;
		var observations = this.get("observationSequence");

		for(i = 1; i <= observations.length; i++) {

			if(observations[i - 1] == 1) {
				transProbs[0][i] = this.get("H_B") * 
								   (transProbs[0][i - 1] * this.get("B_B") +
								    transProbs[1][i - 1] * this.get("B_L"));
				transProbs[1][i] = this.get("H_L") * 
								   (transProbs[0][i - 1] * this.get("L_B") +
								    transProbs[1][i - 1] * this.get("L_L"));
			} else {
				transProbs[0][i] = this.get("T_B") * 
								   (transProbs[0][i - 1] * this.get("B_B") +
								    transProbs[1][i - 1] * this.get("B_L"));
				transProbs[1][i] = this.get("T_L") * 
								   (transProbs[0][i - 1] * this.get("L_B") +
								    transProbs[1][i - 1] * this.get("L_L"));
			}
		}

		this.set("Pe1_n", this.get("F_B") * (transProbs[0][i - 1] + transProbs[1][i - 1]));



		this.set("forwardProbs", transProbs);
	},

	backwardAlgorithm: function() {
		
		var transProbs = [[this.get("F_B")], [this.get("F_L")]];
		var  i = null;
		var observations = this.get("observationSequence").concat(); // Make copy of observationSequence.
		observations.reverse(); // Reverse the copy of observationSequence.

		for(i = 1; i <= observations.length; i++) {

			if(observations[i - 1] == 1) {
				transProbs[0][i] = transProbs[0][i - 1] * this.get("B_B") * this.get("H_B") +
								    transProbs[1][i - 1] * this.get("L_B") * this.get("H_L");
				transProbs[1][i] = transProbs[0][i - 1] * this.get("B_B") * this.get("H_B") +
								    transProbs[1][i - 1] * this.get("L_B") * this.get("H_L");
			} else {
				transProbs[0][i] = transProbs[0][i - 1] * this.get("B_B") * this.get("T_B") +
								    transProbs[1][i - 1] * this.get("L_B") * this.get("T_L");
				transProbs[1][i] = transProbs[0][i - 1] * this.get("B_B") * this.get("T_B") +
								    transProbs[1][i - 1] * this.get("L_B") * this.get("T_L");
			}
		}

		transProbs[0].reverse();
		transProbs[1].reverse();

		this.set("Pe1_n", transProbs[0][transProbs[0].length - 1] * (transProbs[0][0] + transProbs[1][0]));



		this.set("backProbs", transProbs);
	},

	calculateTransitionProbabilities: function() {
		var notNormalized  = [[], [], [], []], normalized = [[], [], [], []];
		var i = null;
		var f = this.get("forwardProbs");
		var b = this.get("backProbs");
		var observations = this.get("observationSequence");
		var length = observations.length;


		for(i = 0; i < observations.length; i++) {
			
			if(observations[i] === 1) {
				notNormalized[0][i] = f[0][i] * this.get("B_B") * this.get("H_B") * b[1][i + 1];
				notNormalized[1][i] = f[1][i] * this.get("B_L") * this.get("H_B") * b[1][i + 1];
				notNormalized[2][i] = f[0][i] * this.get("L_B") * this.get("H_L") * b[1][i + 1];
				notNormalized[3][i] = f[1][i] * this.get("L_L") * this.get("H_L") * b[1][i + 1];
			} else {
				notNormalized[0][i] = f[0][i] * this.get("B_B") * this.get("T_B") * b[1][i + 1];
				notNormalized[1][i] = f[1][i] * this.get("B_L") * this.get("T_B") * b[1][i + 1];
				notNormalized[2][i] = f[0][i] * this.get("L_B") * this.get("T_L") * b[1][i + 1];
				notNormalized[3][i] = f[1][i] * this.get("L_L") * this.get("T_L") * b[1][i + 1];
			}

			normalized[0][i] = notNormalized[0][i] / this.get("Pe1_n");
			normalized[1][i] = notNormalized[1][i] / this.get("Pe1_n");
			normalized[2][i] = notNormalized[2][i] / this.get("Pe1_n");
			normalized[3][i] = notNormalized[3][i] / this.get("Pe1_n");

		}

			normalized[0].push(0);
			normalized[1].push(0);
			normalized[2].push(0);
			normalized[3].push(0);

		// Sum each array and put result in last index of each array.
		for(i = 0; i < observations.length; i++) {
			normalized[0][length] += normalized[0][i];
			normalized[1][length] += normalized[1][i];
			normalized[2][length] += normalized[2][i];
			normalized[3][length] += normalized[3][i];
		}

		// Update transition probabilites.
		this.set("B_B", normalized[0][length] / (normalized[0][length] + normalized[2][length]));
		this.set("B_L", normalized[1][length] / (normalized[1][length] + normalized[3][length]));
		this.set("L_B", normalized[2][length] / (normalized[2][length] + normalized[0][length]));
		this.set("L_L", normalized[3][length] / (normalized[3][length] + normalized[1][length]));




	},

	calculateSensoryProbabilities: function() {

		var temp = [], sensoryProbs = [];
		var i = null, j = null, sum = 0;
		var observations = this.get("observationSequence");
		var fp = this.get("forwardProbs");
		var bp = this.get("backProbs");

		// temp[] will be filled with the calculated expected number
		// of times observation a appears in state k: P'(a|k) = Sum(f_k(i) * b_k(i)/ P(e_1:n))
		// in the following sequence starting at index 0:
		// temp = [P'(H|B), P'(T|B), P'(H|L), P'(T|L)].
		for(i = 0; i < 4; i++) {

			if( i % 2) {

				for(j = 0; j < observations.length; j++) {
					if(observations[j] == 0) {
						if(i == 1) {
							sum += fp[0][j + 1] * bp[0][j + 1];
						} else {
							sum += fp[1][j + 1] * bp[1][j + 1];
						}
						
					}
				}

				temp.push(sum / this.get("Pe1_n"));
				sum = 0;

			} else {

				for(j = 0; j < observations.length; j++) {
					if(observations[j] == 1) {
						if(i == 0) {
							sum += fp[0][j + 1] * bp[0][j + 1];
						} else {
							sum += fp[1][j + 1] * bp[1][j + 1];
						}
						
					}
				}

				temp.push(sum / this.get("Pe1_n"));
				sum = 0;
			}

		}



		// Calculate normalized sensory probabilities.
		// For example, P(H|B) = P'(H|B) / P'(H|B) + P'(T|B).
		// Result:   sensoryProbs = [P(H|B), P(T|B), P(H|L), P(T|L)].
		for(i = 0; i < temp.length; i++) {
			if(i % 2) {
				sensoryProbs[i] = temp[i] / (temp[i] + temp[i - 1]);
			} else {
				sensoryProbs[i] = temp[i] / (temp[i] + temp[i + 1]);
			}
		}

		

		// Update sensory probabilites.
		this.set("H_B", sensoryProbs[0]);
		this.set("T_B", sensoryProbs[1]);
		this.set("H_L", sensoryProbs[2]);
		this.set("T_L", sensoryProbs[3]);





		
	},

	vertibiAlgorithm: function(observationSequence) {
		// TODO: Implement Virtibi Algorithm.
		var i = null, t = null, prev_P_B = this.get("F_B"), prev_P_L = this.get("F_L");
		var observations = observationSequence;
		var temp = [], history = [], indices = [];

		for(i = 0; i < observations.length; i++) {

			
			if(observations[i] == 1) {
				
				temp.push(prev_P_B * this.get("H_B") * this.get("B_B"));
				temp.push(prev_P_L * this.get("H_B") * this.get("B_L"));
				temp.push(prev_P_B * this.get("H_L") * this.get("L_B"));
				temp.push(prev_P_L * this.get("H_L") * this.get("L_L"));
			} else {
				temp.push(prev_P_B * this.get("T_B") * this.get("B_B"));
				temp.push(prev_P_L * this.get("T_B") * this.get("B_L"));
				temp.push(prev_P_B * this.get("T_L") * this.get("L_B"));
				temp.push(prev_P_L * this.get("T_L") * this.get("L_L"));
			}

			prev_P_B = Math.max(temp[0], temp[1]);
			prev_P_L = Math.max(temp[2], temp[3]);

			
			history[i] = [[temp[0]], [temp[1]], [temp[2]], [temp[3]]];

			temp = [];

		}
		
		t = this.getMaxValueandIndex(history[history.length - 1]);
		indices.push(t.index);

		if(t.index > 1) {
			temp.push("L");
		} else {
			temp.push("B");
		}

		for(i = history.length - 2; i >= 0; i--) {
			if(t.index == 1 || t.index == 3) {
				t = this.getMaxValueandIndex([history[i][2], history[i][3]]);
				temp.push("L");
				t.index += 2;
			} else {
				t = this.getMaxValueandIndex([history[i][0], history[i][1]]);
				temp.push("B");	
			}

			// Temporary device for console feedback.
			indices.push(t.index);
		}	

		
		this.set("stateSequence", temp.reverse());


	},

	getMaxValueandIndex: function(array) {
		var max = array[0], index = 0, results = {};

		for(var i = 1; i < array.length; i++) {
			if(array[i] > max) {
				max = array[i];
				index = i;
			}
		}

		results = {max: max, index: index};

		return results;
	},

	
	generateData: function(n) {
		
		var size = n;
		var number = Math.random(); // Randomly generate a number between 0 and 1;
		var stateSequence = [], observationSequence = [];
		var temp;

		// Randomly generate state sequence of length equal to prompted variable "size."

		while(stateSequence.length < size) {
			temp = stateSequence.pop();

			if(temp == "B") {

			
					if(number <= this.get("generated_B_B")) {
						stateSequence.push(temp);
						stateSequence.push("B"); // B to B
					} else {
						stateSequence.push(temp);
						stateSequence.push("L"); // B to L
					}

			} else if (temp == "L") {

				
					if(number <= this.get("generated_L_L")) {
						stateSequence.push(temp);
						stateSequence.push("L"); // L to L
					} else {
						stateSequence.push(temp);
						stateSequence.push("B"); // L to B
					}
				
			} else {

					stateSequence.push("B");	
			}

			number = Math.random(); // Generate number for next iteration.
		}

		this.set("generatedStateSequence", stateSequence);

		number = Math.random();

		// Randomly generate observation sequence of length equal to prompted variable "size."

		for(var i = 0; observationSequence.length < size && i < stateSequence.length; i++) {

			if(stateSequence[i] == "B") {

					if(number <= this.get("generated_T_B")) {
						observationSequence.push(0);
					} else {
						observationSequence.push(1);
					}	
			}

			if(stateSequence[i] == "L") {

					if(number <= this.get("generated_T_L")) {
						observationSequence.push(0);
					} else {
						observationSequence.push(1);
					}	
			}

			number = Math.random();
					
		}

		

		this.set("generatedObservationSequence", observationSequence);


		
	},


	calculateContingencyTableData: function() {

		var viterbiStates = this.get("stateSequence");
		var actualStates = this.get("generatedStateSequence");
		var tn = 0, tp = 0, fn = 0, fp = 0;

		if( viterbiStates.length == actualStates.length) {

			for(var i = 0; i < actualStates.length; i++) {

				if(actualStates[i].toUpperCase() == "B") {
					if(viterbiStates[i].toUpperCase() == "B") {
						tp++;
					} else {
						fn++;
					}
				} else if(actualStates[i].toUpperCase() == "L") {
					if(viterbiStates[i].toUpperCase() == "L") {
						fp++;
					} else {
						tn++;
					}
				} else {

					console.log("ERROR: Either em_virtibi.stateSequence or em_virtibi.generatedStateSequence contain invalid data. Aborting em_virtibi.calculateContingencyTableData() function call.");
				}
			}


		} else {

			console.log("ERROR: The lengths of em_virtibi.stateSequence and em_virtibi.generatedStateSequence are not equal. Aborting em_virtibi.calculateContingencyTableData() function call");
		}

		this.set("tp", tp);
		this.set("tn", tn);
		this.set("fp", fp);
		this.set("fn", fn);

;

		return ( (tn + tp + fn + fp) == viterbiStates.length );

	},

	calculateSensitivity: function() {
		
		var sensitivity = 0.0;

		sensitivity = this.get("tp") / (this.get("tp") + this.get("fn"));

		this.set("sensitivity", sensitivity);

	},

	calculateSpecificity: function() {

		var specificity = 0.0;

		specificity = this.get("tn") / (this.get("tn") + this.get("fp"));

		this.set("specificity", specificity);
	},

	calculateAccuracy: function() {

		var accuracy = 0.0;

		accuracy = (this.get("tp") + this.get("tn")) / this.get("stateSequence").length;

		this.set("accuracy", accuracy);

	},

	calculateFPR: function() {

		var fpr = 0.0;

		fpr = this.get("fp") / (this.get("fp") + this.get("tn"));

		this.set("fpr", fpr);

	},

	reset: function() {

		this.set({
			F_B: 0.5,
			F_L: 0.5,
			Pe1_n: 0.0,
			B_B: 0.6,
			B_L: 0.3,
			L_L: 0.7,
			L_B: 0.4,
			H_B: 0.5,
			T_B: 0.5,
			H_L: 0.1,
			T_L: 0.9,
			generated_B_B: 0.6,
			generated_B_L: 0.3,
			generated_L_L: 0.7,
			generated_L_B: 0.4,
			generated_H_B: 0.5,
			generated_T_B: 0.5,
			generated_H_L: 0.1,
			generated_T_L: 0.9,
			n: 0,
			t: 0,
			size: 0,
			fileInputError: false,
			backProbs: null,
			forwardProbs: null,
			observationSequence: [],
			generatedStateSequence: [],
			generatedObservationSequence: [],
			stateSequence: [],
			specificity: 0.0,
			sensitivity: 0.0,
			tn: 0,
			tp: 0,
			fn: 0,
			fp: 0,
			accuracy: 0.0,
			fpr: 0.0
		});
	}


});

var em_virtibi = new EM_Virtibi();
