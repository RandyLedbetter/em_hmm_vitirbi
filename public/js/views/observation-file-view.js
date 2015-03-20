var ObservationFileView = Backbone.View.extend({

    initialize: function() {
	  this.template = _.template(tpl.get("observation-file-view"));
      this.render();

    },

    

    


    render: function() {

      // Render template.
      $(this.el).html(this.template());
      return this;
    }

});