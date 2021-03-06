var seriesOptions = [],
    seriesCounter = 0,
    maxplayers = 100,
    showlegend = (window.mobileAndTabletcheck()) ? false : true,
    inputs = (window.mobileAndTabletcheck()) ? false : true;

function createChart() {
    Highcharts.stockChart('js-highstock', {

      rangeSelector: {
          buttons: [{
               type: 'hour',
               count: 1,
               text: '1H'
           }, {
               type: 'day',
               count: 1,
               text: '1D'
           }, {
               type: 'day',
               count: 7,
               text: '1W'
           }, {
               type: 'day',
               count: 30,
               text: '1M'
           }, {
               type: 'day',
               count: 90,
               text: '3M'
           }, {
               type: 'all',
               count: 1,
               text: '∞'
           }],
           inputEnabled: inputs,
          selected: 1
      },

        yAxis: {
            plotLines: [{
                value: 300,
                width: 2,
                color: 'silver',
                dashStyle: 'shortdash',
                label: {
                    text: 'APEX Maximum Players Capacity'
                }
            }, {
                value: maxplayers,
                width: 2,
                color: 'red',
                dashStyle: 'shortdash',
                label: {
                    text: 'Maximum players ever spotted on server'
                }
            }, {
                value: 60,
                width: 2,
                color: 'blue',
                dashStyle: 'shortdash',
                label: {
                    text: 'Servidor HUEHUEBR Maximum Players Capacity'
                }
            }]
        },

        tooltip: {
            valueDecimals: 0,
            split: false
        },

          legend: {
                  enabled: showlegend,
                  align: 'left',
                  verticalAlign: 'top',
                  layout: 'vertical',
                  floating: false,
                  borderColor: '#999999',
                  borderRadius: 0,
                  borderWidth: 0,
                  x: -10,
                  //y: 35,
                  backgroundColor: 'rgba(255,255,255,.7)',
                  itemStyle: {
                      "fontWeight": "normal",
                  }
              },

        credits: {
          enabled: false,
        },

        exporting: {
          enabled: false,
        },

        series: seriesOptions
    });
}

$.each(names, function(i, name) {
    $.getJSON('https://launcher.soapboxrace.world/stats/api/fetchServerInformation.php?name=' + name + '&callback=?', function(data) {
        for (index = data.length - 1; index >= 0; index = index - 1) {
            rate = data[index][1];
            if (rate > maxplayers) {
                maxplayers = rate;
            }
        }

        seriesOptions[i] = {
            name: name,
            type: 'area',
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.Color(Highcharts.getOptions().colors[i]).setOpacity(0.1).get('rgba')],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[i]).setOpacity(0).get('rgba')]
                ]
            },

            data: data
        };

        seriesCounter += 1;

        jQuery(".loading2").show();
        jQuery(".progress").show();
        jQuery(".loaded").text(seriesCounter);

        jQuery(".progress-bar").css("width", Math.round(100/names.length*parseInt(seriesCounter)) + "%");

        jQuery(".srvname").text("[" + name + "]");

        if (seriesCounter === names.length) {
            var x = setInterval(function() {
                createChart();
                clearInterval(x);
            }, 500);
        }
    });
});
