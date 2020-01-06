function gameClass(now, aGame) {
  var gameStart = moment.tz(aGame.date, 'UTC');
  var gameEnd   = gameStart.clone().add(105, 'minutes');

  if (gameEnd < now) {
    return 'past';
  }
  if (gameStart <= now && now <= gameEnd) {
    return 'present';
  }

  return 'future';
}

function showHide(show) {
  if (show) {
    $('.past').show(400);
  } else {
    $('.past').hide(400);
  }
}

$(document).ready(function() {
  var now             = new Date();
  var ms_now          = now.getTime();
  var start_of_jan    = new Date('2020/01/01 00:00:00');
  var ms_start_of_jan = start_of_jan.getTime();
  var end_of_jan      = new Date('2020/02/01 00:00:00');
  var ms_end_of_jan   = end_of_jan.getTime();

  var ms_in_jan       = ms_end_of_jan - ms_start_of_jan;
  var ms_thru_jan     = ms_now - ms_start_of_jan;

  var jan_percent  = (ms_thru_jan * 100) / ms_in_jan;

  $('#data').html(jan_percent.toFixed(2) + '%');

  var yourtimezone = moment.tz.guess();
  $('#yourtimezone').html(yourtimezone);

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
});
