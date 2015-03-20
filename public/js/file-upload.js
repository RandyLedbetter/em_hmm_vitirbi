  var input = [], parsedInput = [], observation_file = null, probability_file = null;

  function isValidProbabilityValue(param) {
    var temp = parseFloat(param);
    return ((typeof temp === "number") && (temp%1 !== 0) && (temp <= 1));
  }


  function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    
    for (var i = 0, f; f = files[i]; i++) {

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          
          
          

          if(evt.srcElement.id == "observation-file") {
            input = e.target.result.replace(/\s+/g, "");
            parsedInput = [];
            for(var i = 0, j = 0; i < input.length; i++) {
             
                parsedInput[j++] = parseInt(input[i], 10);
            }

            // Test that parsed observation input array is
            // equal in length to the user's input value of n.
            if(parsedInput.join("").match(/(\D|[2-9])/)) {
              em_virtibi.set("fileInputError", true);
              errorMessage1 = "An error occurred while parsing your observation sequence file.\
                                Make sure your file only contains a space delimited list of 1's and 0's.";
            } else {
              em_virtibi.set("fileInputError", false);
            }

          } else if(evt.srcElement.id == "probability-file"){
            
            input = e.target.result.split((/\s+/)|[,]);

            parsedInput = [];

            for(var i = 0, j = 0; i < input.length; i++) {

                if(isValidProbabilityValue(input[i])){
                  parsedInput[j++] = parseFloat(input[i]);
                } 
            }
            // Test for only 8 sensory and transition probability values
            // in parsed result.
            if(parsedInput.length != 8) {
              em_virtibi.set("fileInputError", true);
              errorMessage2 = "The sensory and transition probability file you uploaded, after being \
                               parsed, does not contain exactly eight (8) properly formatted probability \
                               values. Please upload a correctly formatted file with eight probability \
                               values."; 
            } else {
              em_virtibi.set("fileInputError", false);
            }

          }else if(evt.srcElement.id == "state-sequence-file"){
              input = e.target.result.replace(/\s+/g, "");
              parsedInput = [];

              for(var i = 0, j = 0; i < input.length; i++) {
             
                parsedInput[j++] = input[i].toUpperCase();
              }

              // Test that parsed observation input array is
              // equal in length to the user's input value of n.
              if(parsedInput.join("").match(/(\d|[^bBlL])/)) {
                em_virtibi.set("fileInputError", true);
                errorMessage3 = "An error occurred while parsing your state sequence file. Make sure your file only contains a space delimited list of B's and L's.";
              } else {
                em_virtibi.set("fileInputError", false);
              }
          }
          

          var span = document.createElement('span');
          if(em_virtibi.get("fileInputError")) {
            if(evt.srcElement.id == "observation-file") {
              span.innerHTML = ['<h4 class="hmm-file-upload-header-text">File Name: &nbsp;&nbsp;&nbsp;','<span class="text-muted">', escape(theFile.name), '</span>', '</h4>',  '<h4 class="hmm-file-upload-header-text">Length: ','<span class="text-muted">', escape(parsedInput.length), '</span>', '</h4>','<p class="text-danger hmm-file-error-text">', errorMessage1, '</p>'].join('');
              em_virtibi.set("observationSequence", []);
            } else if(evt.srcElement.id == "state-sequence-file") {
              span.innerHTML = ['<h4 class="hmm-file-upload-header-text">File Name: &nbsp;&nbsp;&nbsp;','<span class="text-muted">', escape(theFile.name), '</span>', '</h4>',  '<h4 class="hmm-file-upload-header-text">Length: ','<span class="text-muted">', escape(parsedInput.length), '</span>', '</h4>','<p class="text-danger hmm-file-error-text">', errorMessage3, '</p>'].join('');
              em_virtibi.set("generatedStateSequence", []);
            } else {
              span.innerHTML = ['<h4 class="hmm-file-upload-header-text">File Name: &nbsp;&nbsp;&nbsp;','<span class="text-muted">', escape(theFile.name), '</span>', '</h4>',  '<h4 class="hmm-file-upload-header-text">Length: ','<span class="text-muted">', escape(parsedInput.length), '</span>', '</h4>','<p class="text-danger hmm-file-error-text">', errorMessage2, '</p>'].join('');
            }

          } else {
              span.innerHTML = ['<h4 class="hmm-file-upload-header-success">File Name: ', '<span class="text-success">&nbsp;&nbsp;&nbsp;', escape(theFile.name), '</span>', '</h4>',  '<h4 class="hmm-file-upload-header-text">Length: ', '<span class="text-success">', escape(parsedInput.length), '</span>','</h4>'].join('');

              if(evt.srcElement.id == "observation-file") {
                observation_file = parsedInput;

                // Set Backbone Model data
                observationFile.set("input", input);
                observationFile.set("parsedInput", parsedInput);
                observationFile.set("length", parsedInput.length);
                em_virtibi.set("observationSequence", parsedInput);
                observationFile.set("name", theFile.name);
                console.log("observationFile  Name = " + observationFile.get("name"));
                console.log("observationFile  Parsed Content = " + observationFile.get("parsedInput"));
            } else if(evt.srcElement.id == "probability-file"){
                probability_file = parsedInput;

                // Set Backbone Model data
                probabilityFile.set("input", input);
                probabilityFile.set("parsedInput", parsedInput);
                probabilityFile.set("name", theFile.name);
                probabilityFile.set("length", parsedInput.length);
                em_virtibi.set("B_B", parsedInput[0]);
                em_virtibi.set("L_B", parsedInput[1]);
                em_virtibi.set("B_L", parsedInput[2]);
                em_virtibi.set("L_L", parsedInput[3]);
                em_virtibi.set("H_B", parsedInput[4]);
                em_virtibi.set("T_B", parsedInput[5]);
                em_virtibi.set("H_L", parsedInput[6]);
                em_virtibi.set("T_L", parsedInput[7]);

                em_virtibi.set("generated_B_B", parsedInput[0]);
                em_virtibi.set("generated_L_B", parsedInput[1]);
                em_virtibi.set("generated_B_L", parsedInput[2]);
                em_virtibi.set("generated_L_L", parsedInput[3]);
                em_virtibi.set("generated_H_B", parsedInput[4]);
                em_virtibi.set("generated_T_B", parsedInput[5]);
                em_virtibi.set("generated_H_L", parsedInput[6]);
                em_virtibi.set("generated_T_L", parsedInput[7]);
                console.log("probabilityFile  Name = " + probabilityFile.get("name"));
                console.log("probabilityFile  Parsed Content = " + probabilityFile.get("parsedInput"));
            } else if(evt.srcElement.id == "state-sequence-file"){
                stateSequenceFile.set("input", input);
                stateSequenceFile.set("parsedInput", parsedInput);
                stateSequenceFile.set("length", parsedInput.length);
                em_virtibi.set("generatedStateSequence", parsedInput);
                stateSequenceFile.set("name", theFile.name);
                console.log("stateSequenceFile  Name = " + stateSequenceFile.get("name"));
                console.log("stateSequenceFile  Parsed Content = " + stateSequenceFile.get("parsedInput"));
            }

          }

          if(evt.srcElement.id == "observation-file") {
              $('#observation-file-list').empty().append(span);
          } else if(evt.srcElement.id == "probability-file"){
              $('#probability-file-list').empty().append(span);
          } else if(evt.srcElement.id == "state-sequence-file"){
              $('#state-sequence-file-list').empty().append(span);
          }
          
          
          
          
        };
      })(f);

      reader.readAsText(f);
    }
  }


