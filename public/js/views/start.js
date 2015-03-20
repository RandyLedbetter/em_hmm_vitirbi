var Start = Backbone.View.extend({

    events: {
  	"click #cwm-submit-button-start": "submitParameters",
  	"click .hmm-upload-submit-btn": "submitFiles"
    },

  	initialize: function() {

       em_virtibi.reset();
       
       this.template = _.template(tpl.get('start'));

       this.listenTo(em_virtibi, "change:fileInputError", this.updateErrorMsg);

	},


    updateErrorMsg: function() {
        if(em_virtibi.get("fileInputError")) {

            $("#hmm-file-submit-error-msg").removeClass('hidden');

        } else {

            $("#hmm-file-submit-error-msg").addClass('hidden');
        }
    },

    submitFiles: function() {

        

        

        
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

	    em_virtibi.set("n", number);

	    if(em_virtibi.get("fileInputError") || em_virtibi.get("observationSequence").length < 1) {

            $("#hmm-file-submit-error-msg").removeClass('hidden');

        } else {
            $("#hmm-file-submit-error-msg").addClass('hidden');
            console.log("n = " + em_virtibi.get("n"));
            if(observationFile.get("length") && probabilityFile.get("length")) {
            	app.navigate("/preview", {trigger: true});
            }
            
        }
	},

	render: function() {

	    $(this.el).html(this.template());
	    $('#main-content').empty().append(this.$el);

	    $(document).ready(function() {

		    document.getElementById('observation-file').addEventListener('change', handleFileSelect, false);
		    document.getElementById('probability-file').addEventListener('change', handleFileSelect, false);
        document.getElementById('state-sequence-file').addEventListener('change', handleFileSelect, false);

  		});     
	   
	}

});

