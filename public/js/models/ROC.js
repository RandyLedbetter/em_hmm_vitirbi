 var ROC = Backbone.Model.extend({

        defaults: {
          min: 0,
          max: 100,
          interval: 10,
          data: [],
          options: null,
          nArray: [],
          tprArray: [],
          fprArray: []

        },

        getN: function(index) {
        	var temp = this.get("nArray");
        	return temp[index];
        },

        getTPR: function(index) {
        	var temp = this.get("tprArray");
        	return temp[index];
        },

        getFPR: function(index) {
        	var temp = this.get("fprArray");
        	return temp[index];
        }

});

// Instantiate File Models
var roc = new ROC();

// Set Flot Chart Options