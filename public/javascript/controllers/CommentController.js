(function() {
	'use strict';

	angular.module('app').controller(CommentController, 'CommentController');

	function CommentController (CommentFactory, $stateParams, UserFactory) {
		var vm = this;

		CommentFactory.getAllComments($stateParams.id).then(function(res) {
			vm.comments = res;
		}, function(err){
			//
		});

		vm.createComment = function() {
			console.log();
			if(!UserFactory.status._id){
				//'cant post if not logged in' hacker easter egg alert
				return;
			}
			CommentFactory.createComment(vm.comment, $stateParams.id).then(function(res){
				//some success toast
				//$state change?
				}, function(err) {
				//some error popup/toast
			});
		};
	}

})();