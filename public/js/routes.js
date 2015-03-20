var AppRouter = Backbone.Router.extend({

    routes:{	 
        "preview": "previewView",
        "data-generator": "generateDataView",
        "em-algorithm": "emAlgorithmView",
        "vertibi-algorithm": "vertibiAlgorithmView",
        "em-vertibi-results": "emVertibiResultsView",
        "roc": "rocView",
         "" : "startView"
    },

    makeActive: function(tabText) {
            $('.active').removeClass("active");
            $('.nav a:contains("' + tabText + '")').parent().addClass('active'); 
    },

    generateDataView: function() {
        $('#em-virtibi-app').html(new Layout().render());
        $('#main-content').html(new GenerateDataView().render());
        this.makeActive("Run Data Generator");  
    },

    emAlgorithmView: function() {
        $('#em-virtibi-app').html(new Layout().render());
        $('#main-content').html(new EMAlgorithmView().render());
        this.makeActive("Run EM Algorithm");
    },

    vertibiAlgorithmView: function() {
        $('#em-virtibi-app').html(new Layout().render());
        $('#main-content').html(new VertibiAlgorithmView().render());
        this.makeActive("Run Vertibi Algorithm");
    },

    emVertibiResultsView: function() {
        $('#em-virtibi-app').html(new Layout().render());
        $('#main-content').html(new EMVertibiResultsView().render());
        this.makeActive("Run Full Program");
    },

    previewView: function() {
    	$('#em-virtibi-app').html(new Layout().render());
    	$('#main-content').html(new Preview().render());
    },

    rocView: function() {
        $('#em-virtibi-app').html(new Layout().render());
        $('#main-content').html(new ROCView().render());
        this.makeActive("ROC");
    },

    startView: function() {
    	$('#em-virtibi-app').html(new Layout().render());
        $('#main-content').html(new Start().render());
        em_virtibi.reset();   	
	}

});

tpl.loadTemplates(['layout', 'start', 'preview', 'generate-data-view', 'em-algorithm-view', 'vertibi-algorithm-view', 'em-vertibi-results-view', 'roc-view'], function () {
    app = new AppRouter();
    Backbone.history.start();
});
