var Layout = Backbone.View.extend({

  initialize: function() {
       this.template = _.template(tpl.get('layout'));


    },

    events: {
      
    },

    render: function() {

        $(this.el).html(this.template());
        $('#em-virtibi-app').empty().append(this.$el);
    },

});