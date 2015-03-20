var UploadView = Backbone.View.extend({


    initialize: function() {

      this.template = _.template(tpl.get("upload-files"));

      this.listenTo(em_virtibi, "change:fileInputError", this.updateErrorMsg);
      
    },

    events: {
        "click .hmm-upload-submit-btn": "submitFiles",
        "click .hmm-upload-back-btn": "navigateBack"
    },

    updateErrorMsg: function() {
        if(em_virtibi.get("fileInputError")) {

            $("#hmm-file-submit-error-msg").removeClass('hidden');

        } else {

            $("#hmm-file-submit-error-msg").addClass('hidden');
        }
    },

    submitFiles: function() {

        if(em_virtibi.get("fileInputError") || em_virtibi.get("observationSequence").length < 1) {

            $("#hmm-file-submit-error-msg").removeClass('hidden');

        } else {
            $("#hmm-file-submit-error-msg").addClass('hidden');
            console.log("size = " + em_virtibi.get("n") + "  observationSequence.length = " + em_virtibi.get("observationSequence").length);
            console.log("observationSequence = " + em_virtibi.get("observationSequence"));
            app.navigate("/preview", {trigger: true})
        }

        

        
    },

    navigateBack: function() {
        app.navigate("/", {trigger: true});
    },
   
    render: function() {

      
     $(this.el).html(this.template());
     $("#main-content").empty().append(this.$el);

     // Create child views and assign them to parent elements.
     this.observationFileView = new ObservationFileView( {el: "#observation-file-view", model: observationFile} );
     this.probabilityFileView = new ProbabilityFileView( {el: "#probability-file-view", model: probabilityFile} );
     $(document).ready(function() {

    document.getElementById('observation-file').addEventListener('change', handleFileSelect, false);
    document.getElementById('probability-file').addEventListener('change', handleFileSelect, false);

  }
);
    }

 });





/*var UploadFiles = Backbone.View.extend({

	model: File,

	initialize: function() {
		this.template = _.template(tpl.get("upload-files"));
	},

	render: function() {
		$(this.el).html(this.template());
		$("#main-content").empty().append(this.$el);
	}

});*/