var EMVertibiResultsView = Backbone.View.extend({

	initialize: function() {
		this.template = _.template(tpl.get("em-vertibi-results-view"));
	},

	events: {
		"click div#cwm-back-button-preview": "startOver"
	},

	runProgram: function() {

		// User did not provide actual state sequence. Generate it.
		if(em_virtibi.get("generatedStateSequence").length == 0) {
			em_virtibi.set("size", em_virtibi.get("observationSequence").length);
	    	em_virtibi.generateData(em_virtibi.get("size"));
		}
		

	    // Temporary Console Feedback.
	    console.log("generatedObservationSequence = " + em_virtibi.get("generatedObservationSequence"));
	    console.log("generatedObservationSequence.length = " + em_virtibi.get("generatedObservationSequence").length);
	    console.log("generatedStateSequence = " + em_virtibi.get("generatedStateSequence"));
	    console.log("generatedStateSequence.length = " + em_virtibi.get("generatedStateSequence").length);

	    // Run EM Algorithm N times.
	    for(var i = 0; i < em_virtibi.get("n"); i++) {
	        em_virtibi.forwardAlgorithm();
	        em_virtibi.backwardAlgorithm();
	        em_virtibi.calculateTransitionProbabilities();
	        em_virtibi.calculateSensoryProbabilities();
	    }

	    // Run Vertibi Algorithm.
	    em_virtibi.vertibiAlgorithm(em_virtibi.get("observationSequence"));

	    // Run Binary Classification Algorithms.
	    em_virtibi.calculateContingencyTableData();
	    em_virtibi.calculateSensitivity();
	    em_virtibi.calculateSpecificity();
	    em_virtibi.calculateAccuracy();
	    em_virtibi.calculateFPR();

	},

	startOver: function() {
		em_virtibi.reset();
		app.navigate("/", {trigger: true});
	},

	render: function() {

		this.runProgram();
		$(this.el).html(this.template());
		$("#main-content").empty().append(this.$el);
	}

});