(function() {
    'use strict';
    angular.module('app')
    .controller('CandidateController', CandidateController);

    function CandidateController($scope, $timeout, $stateParams, TweetFactory, CandidateFactory, CommentFactory, UserFactory) {
        var vm = this;
        vm.tweets;
        vm.timeoutHandler;
        vm.comments;
        vm.isEditing = false, vm.daily = true, vm.weekly = false;
        let candidateName;
        let dailyTotals = [], dailyDates = [], favorData = [];
        let weeklyData = [], weeklyPercent = [], weeklyDates = [];
        let day = [], week = [], runningWeekPercent = 0;
        let m = {top: 30, right: 80, bottom: 30, left: 80}; //margins
        let vizWidth = document.getElementById('vizWidth').clientWidth;
        vm.width = vizWidth - m.right - m.left;
        let myEl = angular.element( document.querySelector( '#dailyViz') );
        let myElWeek = angular.element( document.querySelector( '#weeklyViz' ) );


        window.onresize = function() {
          vizWidth = document.getElementById('vizWidth').clientWidth;
          vm.width = vizWidth - m.right - m.left;
          vm.runViz();
        }

        vm.showDaily = function() {
          vm.weekly = false;
          vm.daily = true;
        }

        vm.showWeekly = function() {
          vm.daily = false;
          vm.weekly = true;
        }

        vm.runViz = function() {
          myEl.empty();
          myElWeek.empty();

          let height = 500 - m.top - m.bottom;

          // X scale will fit all values from dailyTotals[] within pixels 0-w
          let x = d3.scale.linear().domain([0, dailyDates.length - 1]).range([0, vm.width]);
          // Y scale will fit values from 0-100 within pixels h-0
          let y = d3.scale.linear().domain([0, 100]).range([height, 0]);

          // create a line function that can convert dailyTotals[] into x and y points
          let line = d3.svg.line()
                .x(function(d,i) {
                  return x(i);
                })
                .y(function(d) {
                  return y(d);
                })

          // Add an SVG(scalable vector graphics) element with the desired dimensions and margin.
          let graph = d3.select("#dailyViz").append("svg")
                .attr("width", vm.width + m.right + m.left)
                .attr("height", height + m.top + m.bottom)
                .append("g")
                .attr("transform", "translate(" + m.left + "," + m.top + ")");

          let formatDate = function(d) {
              return dailyDates[d];
          }

          // create xAxis
          let xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(dailyDates.length - 1)
                .tickFormat(formatDate)
                .tickSize(-height);
          // Add the x-axis.
          graph.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);
          // create yAxis, use orient to put it on left side of graph
          let yAxis = d3.svg.axis().scale(y).ticks(10).orient("left");
          // Add the y-axis to the left, position with translate parameters
          graph.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(-25,0)")
                .call(yAxis);

          graph.append("path").attr("d", line(dailyTotals));

          // ----------------------------------------------------------------------
          // -----------------------------WEEKLY VIZ-------------------------------
          // ----------------------------------------------------------------------

          let xWeek = d3.scale.linear().domain([0, weeklyData.length - 1]).range([0, vm.width]);

          let graphWeek = d3.select("#weeklyViz").append("svg")
                .attr("width", vm.width + m.right + m.left)
                .attr("height", height + m.top + m.bottom)
                .append("g")
                .attr("transform", "translate(" + m.left + "," + m.top + ")");

          let lineWeek = d3.svg.line()
                .x(function(d,i) {
                  return xWeek(i);
                })
                .y(function(d) {
                  return y(d);
                })

          let formatDateWeek = function(d) {
              return weeklyDates[d];
          }

          let xAxisWeek = d3.svg.axis()
                .scale(xWeek)
                .orient("bottom")
                .ticks(weeklyDates.length - 1)
                .tickFormat(formatDateWeek)
                .tickSize(-height);

          graphWeek.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxisWeek);

          graphWeek.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(-25,0)")
                .call(yAxis);

          graphWeek.append("path").attr("d", lineWeek(weeklyPercent));

        }

        CandidateFactory.getCandidateById($stateParams.id).then(function(res) {
            vm.candidate = res;
            candidateName = res.name;
            for (var i = res.favorRatingTotals.length - 1; i > res.favorRatingTotals.length - 8 && i >= 0; i--) {
              dailyTotals.unshift(res.favorRatingTotals[i].percentage);
              dailyDates.unshift(res.favorRatingTotals[i].date);
              favorData.unshift(res.favorRatingTotals[i]);
            }
            for (var a = 0; a < res.favorRatingTotals.length - 1; a++) {
              day.push(res.favorRatingTotals[a]);
              runningWeekPercent += res.favorRatingTotals[a].percentage;
              if (day.length == 7) {
                let currentWeek = {};
                currentWeek.percentage = ((runningWeekPercent / 7));
                currentWeek.date = day[6].date;
                weeklyData.push(currentWeek); weeklyPercent.push(currentWeek.percentage);
                weeklyDates.push(currentWeek.date)
                day = [], runningWeekPercent = 0;
              }
            }

            vm.runViz();


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
            vm.isEditing = comment._id;
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
                vm.isEditing = null;
                vm.editedComment = null;
            }, function(err) {
                alert('could not update comment');
            });
        };



    }
})();
