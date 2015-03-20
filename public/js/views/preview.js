var Preview = Backbone.View.extend({

	initialize: function() {
		this.template = _.template(tpl.get("preview"));
	},

	events: {
		"click div#cwm-back-button-preview": "startOver",
		"click div#cwm-submit-button-preview": "submitParameters"
	},

	startOver: function() {
		em_virtibi.reset();
		app.navigate("/", {trigger: true});
	},

	submitParameters: function() {
		app.navigate("/em-vertibi-results", {trigger: true});
	},

	render: function() {
		$(this.el).html(this.template());
		$("#main-content").empty().append(this.$el);
	}

});