'use strict';

angular.module('concordyaApp')
        .directive('diEcharts', function () {
          return{
            templateUrl: 'scripts/directives/di_echarts/template.html',
            restrict: 'EA',
            replace: true,
            scope: {
              type: '@',
              legendData: '=',
              xaxisData: '=',
              yaxisData: '=',
              seriesData: '=',
              onSelect: '&',
              selectEvent: '='
            },
            link: function (scope, elem) {
              var option = {
                legend: { show: true, orient : 'horizontal', x: 'center', y: 'top', itemGap: 5, padding: 10,
                  textStyle: {fontSize: 10},
                  data:[]},
                series : []
              };
              var seriesType = null;
              var config = echarts.config;
              config.color = ['#ffb100','#28cfef','#8ae245'];
              switch (scope.type) {
                case 'nest-pie':
                  seriesType = 'pie';
                  option.tooltip = {trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)'};
                  option.series.push({
                    radius : [0, 70],
                    itemStyle : {normal : {
                      label : {show: true, position : 'outer', textStyle: {fontSize: 6, fontWeight: 'bold'}},
                      labelLine : {show : false, length: 65}}},
                    data: []
                  });
                  option.series.push({radius : [85, 125],
                    itemStyle : {normal : {label : {show: false}, labelLine : {show : false}}},
                    data: []
                  });
                  break;
                case 'bar':
                  seriesType = 'bar';
                  option.xAxis = [{type: 'value'}];
                  option.yAxis = [{type : 'category', data : []}];
              }

              var chart = null;
              scope.$watch('seriesData', function(seriesData){

                option.legend.data = scope.legendData;
                function updateAxis(xAxis, data) {
                  if (data && data[0] && angular.isArray(data[0])){
                    _.forEach(data, function (item, index) {
                      xAxis && xAxis[index] && (xAxis[index].data = item);
                    });
                  } else {
                    xAxis && xAxis[0] && (xAxis[0].data = data);
                  }
                }
                updateAxis(option.xAxis, scope.xaxisData);
                updateAxis(option.yAxis, scope.yaxisData);

                _.forEach(seriesData, function (data, index) {
                  if (option.series[index]) {
                    option.series[index].name = scope.legendData[index];
                    option.series[index].data = data;
                    option.series[index].type = seriesType;
                    option.series[index].clickable = true;
                  } else {
                    option.series.push({
                      name: scope.legendData[index],
                      type: seriesType,
                      data: data,
                      clickable: true
                    });
                  }
                });
                if (chart) {
                  chart.dispose();
                }
                chart = echarts.init(elem.context);
                chart.setOption(option);
                chart.on(config.EVENT.CLICK, function (event) {
                  scope.selectEvent && (scope.selectEvent.event = event);
                  scope.onSelect && scope.onSelect.call();
                  scope.$apply();
                });
              }, true);
            }
          };
        });
