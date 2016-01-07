(function() {
    'use strict';
    angular.module('app')
    .controller('CandidateController', CandidateController);

    function CandidateController($scope, $timeout, $stateParams, TweetFactory, CandidateFactory, CommentFactory, UserFactory) {
        var vm = this;
        vm.tweets;
        vm.timeoutHandler;
        var candidateName;
        vm.comments;
        vm.isEditing = false;


        CandidateFactory.getCandidateById($stateParams.id).then(function(res) {
            vm.candidate = res;
            candidateName = res.name;
        }, function(err) {
            //
        });

        (function tick() {
            TweetFactory.getCandidateTweets(candidateName).then(function(res) {
                vm.tweets = res;
                vm.timeoutHandler = $timeout(tick, 1000);
            }, function(err) {
                //
            });
        })();

        // Cancel interval on page change
        $scope.$on('$destroy', function(){
            if (angular.isDefined(vm.timeoutHandler)) {
                $timeout.cancel(vm.timeoutHandler);
                vm.timeoutHandler = undefined;
            }
        });
        
        CommentFactory.getAllCandidateComments($stateParams.id).then(function(res) {
            vm.candidate = res;
            console.log(vm.candidate.comments);
        }, function(err){
            //
        });

        vm.createComment = function() {
            if(!UserFactory.status._id){
                //'cant post if not logged in' hacker easter egg alert
                return;
            }
            CommentFactory.createComment(vm.comment, $stateParams.id).then(function(res){
                vm.candidate.comments.unshift(res);
                vm.comment = null;
                //some success toast
                //$state change?
                }, function(err) {
                //some error popup/toast
            });
        };

        vm.deleteComment = function(comment) {
            if(!UserFactory.status._id){
                return;
            }
            else if(UserFactory.status._id !== comment.user){
                alert('You cannot delete this comment');
                return;
            }
            console.log(comment);
            CommentFactory.deleteComment(comment._id).then(function(res){
            vm.candidate.comments.splice(vm.candidate.comments.indexOf(comment), 1);
            }, function(err) {
                alert('could not delete comment');
            });
        };

        vm.showUpdate = function(comment) {
            vm.isEditing = true;
            // vm.commentToEdit = comment;
            vm.editedComment = angular.copy(comment);
        };

        vm.updateComment = function(comment){
            if(!UserFactory.status._id || UserFactory.status._id !== comment.user){
                alert('You cannot update this comment');
                return;
            };
            CommentFactory.updateComment(vm.editedComment, comment).then(function(res){
                vm.candidate.comments.splice(vm.candidate.comments.indexOf(comment), 1);
                vm.candidate.comments.unshift(vm.editedComment);
                vm.isEditing = false;
                vm.editedComment = null;
            }, function(err) {
                alert('could not update comment');
            });
        };



    }
})();
