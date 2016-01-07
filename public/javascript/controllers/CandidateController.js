(function() {
    'use strict';
    angular.module('app')
    .controller('CandidateController', CandidateController);

    function CandidateController($scope, $timeout, $stateParams, TweetFactory, CandidateFactory) {
        var vm = this;
        vm.tweets;
        vm.timeoutHandler;
        var candidateName;
        let dailyTotals = [];

        CandidateFactory.getCandidateById($stateParams.id).then(function(res) {
            vm.candidate = res;
            candidateName = res.name;
            for (var i = 0; i < res.favorRatingTotals.length; i++) {
              dailyTotals.push(res.favorRatingTotals[i].percentage * 100);
            }

            // -------------------------------------------------------
            // ---------------------D3 VIZ----------------------------
            // -------------------------------------------------------

            // define graph dimensions
            let m = [80, 80, 80, 80]; // margins
            let w = 1000 - m[1] - m[3]; // width
            let h = 400 - m[0] - m[2]; // height

            // X scale will fit all values from dailyTotals[] within pixels 0-w
            let x = d3.scale.linear().domain([0, dailyTotals.length - 1]).range([0, w]);
            // Y scale will fit values from 0-100 within pixels h-0
            let y = d3.scale.linear().domain([0, 100]).range([h, 0]);

            // create a line function that can convert dailyTotals[] into x and y points
            let line = d3.svg.line()
                  .x(function(d,i) {
                    return x(i);
                  })
                  .y(function(d) {
                    return y(d);
                  })

            // Add an SVG(scalable vector graphics) element with the desired dimensions and margin.
            let graph = d3.select("#dailyViz").append("svg:svg")
                  .attr("width", w + m[1] + m[3])
                  .attr("height", h + m[0] + m[2])
                  .append("svg:g")
                  .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

            // create xAxis
            let xAxis = d3.svg.axis().scale(x).tickSize(-h);
            // Add the x-axis.
            graph.append("svg:g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + h + ")")
                  .call(xAxis);
            // create yAxis, use orient to put it on left side of graph
            let yAxis = d3.svg.axis().scale(y).ticks(5).orient("left");
            // Add the y-axis to the left, position with translate parameters
            graph.append("svg:g")
                  .attr("class", "y axis")
                  .attr("transform", "translate(-25,0)")
                  .call(yAxis);

            graph.append("svg:path").attr("d", line(dailyTotals));

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
    }
})();
