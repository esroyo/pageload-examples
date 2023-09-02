function buildTimeline(list) {

  const padAmount= 10;
  const numRows = 2 * list.length;
  const maxValue = list[list.length - 1][1];
  const perSpacerRow = maxValue / list.length;
  const chars = {
    first: '┬',
    item: '├',
    last: '└',
    spacer: '┊',
  };

  return list.map(([name, value], idx, list) => {
    const time = String(value.toFixed(2)).padStart(padAmount, ' ');
    let extra = '';
    if (idx < list.length - 1) {
      const diff = list[idx + 1][1] - value;
      const extraRows = Math.round(diff / perSpacerRow);
      extra = Array(extraRows).fill(` ${''.padStart(padAmount, ' ')} ${chars.spacer}`).join('\n');
    }
    let char = chars.item;
    if (idx === 0) { char = chars.first; }
    if (idx === list.length - 1) { char = chars.last; }
    return ` ${time} ${char} ${name}${extra ? `\n${extra}` : ''}`;
  }).join('\n');
}

var timeEntries = [
    ...Object.entries(performance.getEntriesByType('navigation').pop().toJSON()).filter(([k, v]) => ['startTime', 'requestStart', 'responseStart', 'responseEnd', 'domInteractive', 'domContentLoadedEventStart', 'domContentLoadedEventEnd', 'domComplete', 'loadEventStart', 'loadEventEnd'].includes(k)),
  ...performance.getEntries().filter(({ entryType }) => ['visibility-state', 'paint'].includes(entryType)).map(({ entryType, name, startTime }) => [`${entryType}: ${name}`, startTime]),
 ].sort((e1, e2) => e1[1] - e2[1]);

console.log(buildTimeline(timeEntries));
