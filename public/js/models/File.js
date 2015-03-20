 var File = Backbone.Model.extend({

        defaults: {
          name: "file.txt",
          input: [],
          parsedInput: [],
          length: 0,
          inputId: "input-id",
          outputId: "output-id"
        }

});

 // Instantiate File Models
      var observationFile = new File();
      var probabilityFile = new File();
      var stateSequenceFile = new File();