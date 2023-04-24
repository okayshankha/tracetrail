(function ($) {
  'use strict';
  $.fn.andSelf = function () {
    return this.addBack.apply(this, arguments);
  }
  $(function () {
    if ($("#transaction-history").length && 0) {
      var areaData = {
        labels: ["Passed", "Pending"],
        datasets: [{
          data: [12, 88],
          backgroundColor: [
            "#111111", "#00d255"
          ]
        }
        ]
      };
      var areaOptions = {
        responsive: true,
        maintainAspectRatio: true,
        segmentShowStroke: false,
        cutoutPercentage: 70,
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: true
        }
      }
      var transactionHistoryChartPlugins = {
        beforeDraw: function (chart) {
          var width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx;

          ctx.restore();
          var fontSize = 1;
          ctx.font = fontSize + "rem sans-serif";
          ctx.textAlign = 'left';
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#ffffff";

          var text = "$1200",
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2.4;

          ctx.fillText(text, textX, textY);

          ctx.restore();
          var fontSize = 0.75;
          ctx.font = fontSize + "rem sans-serif";
          ctx.textAlign = 'left';
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#6c7293";

          var texts = "Total",
            textsX = Math.round((width - ctx.measureText(text).width) / 1.93),
            textsY = height / 1.7;

          ctx.fillText(texts, textsX, textsY);
          ctx.save();
        }
      }
      var transactionHistoryChartCanvas = $("#transaction-history").get(0).getContext("2d");

      var transactionHistoryChart = new Chart(transactionHistoryChartCanvas, {
        type: 'doughnut',
        data: areaData,
        options: areaOptions,
        plugins: transactionHistoryChartPlugins
      });
    }
  });
})(jQuery);