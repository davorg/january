document.addEventListener('DOMContentLoaded', function() {
  const realNow = new Date();

  // Optional override: ?now=2025-12-15T12:00:00
  // (If omitted, uses the visitor's real local time)
  const now = getOverrideNow(realNow);

  // Optional override: ?month=12&year=2025   (month is 1–12)
  // Optional override: ?thismonth=1         (uses the visitor's current month)
  const target = getTargetMonth(now);

  const tzEl = document.getElementById('yourtimezone');
  if (tzEl) {
    tzEl.textContent = detectedTimeZone();
  }

  if (target.monthIndex === 0) {
    // It's "January tracker" mode: only show progress in January.
    if (now.getMonth() === 0) {
      monthProgress(now.getTime(), target.year, target.monthIndex);
    } else {
      not_target_month(now, target.monthIndex);
    }
  } else {
    // Testing / other month: always show that month’s progress.
    monthProgress(now.getTime(), target.year, target.monthIndex);
  }
});

function detectedTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

function getOverrideNow(fallbackNow) {
  const p = new URLSearchParams(location.search);
  const nowParam = p.get('now');
  if (!nowParam) return fallbackNow;

  const d = new Date(nowParam);
  return Number.isNaN(d.getTime()) ? fallbackNow : d;
}

function getTargetMonth(now) {
  const p = new URLSearchParams(location.search);

  if (p.get('thismonth') === '1') {
    return { year: now.getFullYear(), monthIndex: now.getMonth() };
  }

  const yearParam = parseInt(p.get('year'), 10);
  const monthParam = parseInt(p.get('month'), 10); // 1–12

  if (!Number.isNaN(yearParam) && monthParam >= 1 && monthParam <= 12) {
    return { year: yearParam, monthIndex: monthParam - 1 };
  }

  // Default behaviour: January tracker
  return { year: now.getFullYear(), monthIndex: 0 };
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function monthProgress(ms_now, year, monthIndex) {
  const start = new Date(year, monthIndex, 1, 0, 0, 0, 0);
  const end   = new Date(year, monthIndex + 1, 1, 0, 0, 0, 0);

  const ms_start = start.getTime();
  const ms_end   = end.getTime();

  const ms_in_month   = ms_end - ms_start;
  const ms_thru_month = ms_now - ms_start;

  let percent = (ms_thru_month * 100) / ms_in_month;
  percent = clamp(percent, 0, 100);

  const dataEl = document.getElementById('data');
  if (dataEl) {
    dataEl.textContent = percent.toFixed(0) + '%';
  }

  const donut = document.getElementById('donut');
  if (donut) {
    donut.style.setProperty('--p', percent.toFixed(2));
  }
}

function not_target_month(now, targetMonthIndex) {
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  let when = 'next year';
  if (now.getMonth() === ((targetMonthIndex + 11) % 12)) {
    when = 'next month';
    // Good enough for this toy site; you can make this exact if you care.
    if (now.getDate() >= 28) {
      when = 'soon';
    }
  }

  const dataEl = document.getElementById('data');
  if (dataEl) {
    dataEl.textContent = `It's not ${monthNames[targetMonthIndex]}, is it? Come back ${when}.`;
  }
  const donut = document.getElementById('donut');
  if (donut) {
    donut.style.setProperty('--p', '0');
  }
}
