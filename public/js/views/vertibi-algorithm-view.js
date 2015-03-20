var VertibiAlgorithmView = Backbone.View.extend({

    initialize: function() {
      this.template = _.template(tpl.get("vertibi-algorithm-view"));
      this.listenTo(em_virtibi, "change:fileInputError", this.updateErrorMsg);
      this.listenTo(em_virtibi, "change:n", this.render);
      

    },

    events: {
      "click .cwm-reset-button" : "resetView",
      "click .cwm-submit-button" : "submitParameters"
    },

    resetView: function() {
      em_virtibi.reset();
      this.render();
    },

    submitParameters: function() {


      if(em_virtibi.get("fileInputError") || em_virtibi.get("observationSequence").length < 1) {

            $("#hmm-file-submit-error-msg").removeClass('hidden');

        } else {
          
            $("#hmm-file-submit-error-msg").addClass('hidden');
            console.log("size = " + em_virtibi.get("n") + "  observationSequence.length = " + em_virtibi.get("observationSequence").length);
            console.log("observationSequence = " + em_virtibi.get("observationSequence"));
            if(observationFile.get("length") && probabilityFile.get("length")) {

              em_virtibi.vertibiAlgorithm(em_virtibi.get("observationSequence"));
              this.render();

              $('#em-start-view').addClass("hidden");
              $('#em-results-view').removeClass("hidden");

            }
            
        }
  },

  updateErrorMsg: function() {
        if(em_virtibi.get("fileInputError")) {

            $("#hmm-file-submit-error-msg").removeClass('hidden');

        } else {

            $("#hmm-file-submit-error-msg").addClass('hidden');
        }
    },
    
    render: function() {

      // Render template.
      $(this.el).html(this.template());
      $('#main-content').empty().append(this.$el);
      $('#em-results-view').addClass("hidden");
      $('#em-start-view').removeClass("hidden");

      $(document).ready(function() {

        document.getElementById('observation-file').addEventListener('change', handleFileSelect, false);
        document.getElementById('probability-file').addEventListener('change', handleFileSelect, false);


      }); 

      this.delegateEvents();
    }

});