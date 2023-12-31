const span = (
  str,
  num = 6,
) => (true ? `<span style="opacity:.${num}">${str}</span>` : str);

function buildTimeline(list) {
  const padAmount = 10;
  const maxValue = Math.max(...list.map(([, v]) => v));
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
      extra = Array(extraRows).fill(
        ` ${''.padStart(padAmount, ' ')} ${span(chars.spacer, 5)}`,
      ).join('\n');
    }
    let char = chars.item;
    if (idx === 0) char = chars.first;
    if (idx === list.length - 1) char = chars.last;
    return ` ${time} ${span(char, 5)} ${name}${extra ? `\n${extra}` : ''}`;
  }).join('\n');
}

function getPerformanceEntries() {
  const navigationProps = [
    'startTime',
    'requestStart',
    'responseStart',
    'responseEnd',
    'domInteractive',
    'domContentLoadedEventStart',
    'domContentLoadedEventEnd',
    'domComplete',
    'loadEventStart',
    'loadEventEnd',
  ];

  const entryTypes = ['paint', 'mark'];
  const resourceTypes = ['script', 'link'];

  return [
    ...performance.getEntriesByType('resource').filter(({ initiatorType }) =>
      resourceTypes.includes(initiatorType)
    ).flatMap(({ initiatorType, name: fullName, responseEnd, startTime }) => {
      const name = `${initiatorType}("…${fullName.slice(-20)}")`;
      return [[`resourceStart: ${span(name)}`, startTime], [
        `resourceEnd: ${span(name)}`,
        responseEnd,
      ]];
    }),
    ...performance.getEntries().filter(({ entryType }) =>
      entryTypes.includes(entryType)
    ).map((
      { entryType, name, startTime },
    ) => [`${entryType}: ${span(name)}`, startTime]),
    ...Object.entries(performance.getEntriesByType('navigation').pop().toJSON())
      .filter(([k, v]) => navigationProps.includes(k)),
  ].sort((e1, e2) => e1[1] - e2[1]);
}

console.log(buildTimeline(getPerformanceEntries()));
