var ProbabilityFileView = Backbone.View.extend({

    initialize: function() {
      this.template = _.template(tpl.get("probability-file-view"));
      // Render the view.
      this.render();

    },

   

    


    render: function() {

      // Render template.
      $(this.el).html(this.template());
      return this;
    }

});