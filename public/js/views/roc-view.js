var ROCView = Backbone.View.extend({

    events: {
  	"click div#cwm-submit-button-roc": "submitParameters"
    },

  	initialize: function() {
       
       this.template = _.template(tpl.get('roc-view'));
       this.listenTo(em_virtibi, "change:fileInputError", this.updateErrorMsg);
       em_virtibi.set("t", 0);

	},


	submitParameters: function() {

    if(em_virtibi.get("observationSequence").length &&
                        !em_virtibi.get("fileInputError")) {


      if(em_virtibi.get("t") == 0) {
        var number = $("#hmm-number-input").val();
      } else {
        var number = $("#hmm-number-input2").val();
      }
      

      if(number) {

        $("#hmm-number-input-error").addClass('hidden');
        number = Math.floor(number);


      } else {

        $("#hmm-number-input-error").removeClass('hidden');
        return false;

      }

      em_virtibi.set("n", number);

          if(em_virtibi.get("t") == 0) {
            em_virtibi.set("t", 1);

            // User did not submit actual state sequences. Generate a sequence.
            if(em_virtibi.get("generatedStateSequence").length == 0) {
              em_virtibi.set("size", em_virtibi.get("observationSequence").length);
              em_virtibi.generateData(em_virtibi.get("size"));
            }
            
            
            
            $("#hmm-roc-form-inputs").addClass("hidden");
            $("#hmm-roc-results").removeClass("hidden");

            this.runProgram();

          } else {
              var pfile = probabilityFile.get("parsedInput");
              em_virtibi.set("B_B", pfile[0]);
              em_virtibi.set("L_B", pfile[1]);
              em_virtibi.set("B_L", pfile[2]);
              em_virtibi.set("L_L", pfile[3]);
              em_virtibi.set("H_B", pfile[4]);
              em_virtibi.set("T_B", pfile[5]);
              em_virtibi.set("H_L", pfile[6]);
              em_virtibi.set("T_L", pfile[7]);

              em_virtibi.set("generated_B_B", pfile[0]);
              em_virtibi.set("generated_L_B", pfile[1]);
              em_virtibi.set("generated_B_L", pfile[2]);
              em_virtibi.set("generated_L_L", pfile[3]);
              em_virtibi.set("generated_H_B", pfile[4]);
              em_virtibi.set("generated_T_B", pfile[5]);
              em_virtibi.set("generated_H_L", pfile[6]);
              em_virtibi.set("generated_T_L", pfile[7]);
              $("#chart1").empty();
              this.runProgram();
          }
          
       

    }



	},

  runProgram: function() {

    var sampleSet = [], data = [];

    sampleSet.push(0);
    sampleSet.push(Math.floor(em_virtibi.get("n")/2));
    sampleSet.push(em_virtibi.get("n"));


      

 

      // Run EM Algorithm N times.
      for(i = 0, j = 0; i <= em_virtibi.get("n"); i++) {
          em_virtibi.forwardAlgorithm();
          em_virtibi.backwardAlgorithm();
          em_virtibi.calculateTransitionProbabilities();
          em_virtibi.calculateSensoryProbabilities();

          // Run Vertibi Algorithm.
          em_virtibi.vertibiAlgorithm(em_virtibi.get("observationSequence"));

          // Run Binary Classification Algorithms.
          em_virtibi.calculateContingencyTableData();
          em_virtibi.calculateSensitivity();
          em_virtibi.calculateSpecificity();
          em_virtibi.calculateAccuracy();
          em_virtibi.calculateFPR();

          if( i == sampleSet[j]) {
            data.push([em_virtibi.get("fpr"), em_virtibi.get("sensitivity"), 'N = ' + i]);
            roc.get("tprArray").push(em_virtibi.get("sensitivity"));
            roc.get("fprArray").push(em_virtibi.get("fpr"));
            roc.get("nArray").push(i);
            console.log('data point at n = ' + i);
            j++;
          }
      }

      
    var randomLine = [[0.0, 0.0], [1.0, 1.0]];
  
      
  $.jqplot ('chart1', [data, randomLine], {
      // Give the plot a title.
      title: 'ROC Curve',
      // You can specify options for all axes on the plot at once with
      // the axesDefaults object.  Here, we're using a canvas renderer
      // to draw the axis label which allows rotated text.
      axesDefaults: {
        labelRenderer: $.jqplot.CanvasAxisLabelRenderer
      },
      // Likewise, seriesDefaults specifies default options for all
      // series in a plot.  Options specified in seriesDefaults or
      // axesDefaults can be overridden by individual series or
      // axes options.
      // Here we turn on smoothing for the line.
      seriesDefaults: {
          rendererOptions: {
              smooth: true 
      
          },

          
          pointLabels: { show:true, location: 'se' }
      },
      // An axes object holds options for all axes.
      // Allowable axes are xaxis, x2axis, yaxis, y2axis, y3axis, ...
      // Up to 9 y axes are supported.
      axes: {
        // options for each axis are specified in seperate option objects.
        xaxis: {
          label: "FPR (1 - Specificity)",
          numberTicks: 10,
          tickInterval: 0.1,
          min: 0.0,
          max: 1.0,
          // Turn off "padding".  This will allow data point to lie on the
          // edges of the grid.  Default padding is 1.2 and will keep all
          // points inside the bounds of the grid.
          pad: 0
        },
        yaxis: {
          label: "TPR (Sensitivity)",
          numberTicks: 10,
          tickInterval: 0.1,
          min: 0.0,
          max: 1.0
        }
      },



      legend: {
        show: true,
        labels: ['Binary Classifier', 'Random Chance'],
        location: 'ne',
        placement: 'inside'
      }    
    });

console.log(data);

    


  },

  updateErrorMsg: function() {
      if(em_virtibi.get("fileInputError")) {

          $("#hmm-file-submit-error-msg").removeClass('hidden');

      } else {

          $("#hmm-file-submit-error-msg").addClass('hidden');
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

