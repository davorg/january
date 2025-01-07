document.addEventListener('DOMContentLoaded', function() {
  var now = new Date();

  if (now.getMonth()) {
    not_january(now);
  } else {
    january(now.getTime(), now.getFullYear());
  }
});

function january(ms_now, year) {
  var start_of_jan    = new Date(year + '/01/01 00:00:00');
  var ms_start_of_jan = start_of_jan.getTime();
  var end_of_jan      = new Date(year + '/02/01 00:00:00');
  var ms_end_of_jan   = end_of_jan.getTime();

  var ms_in_jan       = ms_end_of_jan - ms_start_of_jan;
  var ms_thru_jan     = ms_now - ms_start_of_jan;

  var jan_percent  = (ms_thru_jan * 100) / ms_in_jan;

  document.getElementById('data').innerHTML = jan_percent.toFixed(0) + '%';

  // var yourtimezone = moment.tz.guess();
  // document.getElementById('yourtimezone').innerHTML = yourtimezone;

  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    title: {
      text: ""
    },
    data: [{
      type: "pie",
      startAngle: 270,
      yValueFormatString: "##0\"%\"",
      indexLabel: "{label} {y}",
      dataPoints: [
        {y: jan_percent, label: "Done", color: "green"},
        {y: 100 - jan_percent, label: "To do", color: "white" },
      ]
    }]
  });
  chart.render();
}

function not_january(now) {
    var when = 'next year';
    if (now.getMonth() == 11) {
      when = 'next month';
      if (now.getDate() == 31) {
        when = 'tomorrow';
      }
    }
    
    document.getElementById('data').innerHTML =
      "<br>It's not January, is it? Come back " + when + ".";
}
