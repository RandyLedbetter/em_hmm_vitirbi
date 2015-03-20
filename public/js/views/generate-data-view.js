var GenerateDataView = Backbone.View.extend({

    initialize: function() {
      this.template = _.template(tpl.get("generate-data-view"));
    },

    events: {
  	"click #cwm-submit-button-start": "submitParameters"
    },

    submitParameters: function() {

		var number = $("#hmm-number-input").val();

	    if(number) {

	    	$("#hmm-number-input-error").addClass('hidden');
	   		number = Math.floor(number);


	    } else {

	   		$("#hmm-number-input-error").removeClass('hidden');
	   		return false;

	    }

	    em_virtibi.set("size", number);
	    em_virtibi.generateData(em_virtibi.get("size"));

	    
	    console.log("generatedObservationSequence = " + em_virtibi.get("generatedObservationSequence"));
	    console.log("generatedObservationSequence.length = " + em_virtibi.get("generatedObservationSequence").length);
	    console.log("generatedStateSequence = " + em_virtibi.get("generatedStateSequence"));
	    console.log("generatedStateSequence.length = " + em_virtibi.get("generatedStateSequence").length);
	    this.render();

	},

    
    render: function() {

      // Render template.
      $(this.el).html(this.template());
      $('#main-content').empty().append(this.$el);
      this.delegateEvents();
    }

});