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
            extra = Array(extraRows).fill(` ${''.padStart(padAmount, ' ')} ${chars.spacer}`).join('\n');
        }
        let char = chars.item;
        if (idx === 0) {char = chars.first;}
        if (idx === list.length - 1) {char = chars.last;}
        return ` ${time} ${char} ${name}${extra ? `\n${extra}` : ''}`;
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

    const entryTypes = ['paint'];

    return [
        ...Object.entries(performance.getEntriesByType('navigation').pop().toJSON()).filter(([k, v]) => navigationProps.includes(k)),
        ...performance.getEntries().filter(({entryType}) => entryTypes.includes(entryType)).map(({entryType, name, startTime}) => [`${entryType}: ${name}`, startTime]),
    ].sort((e1, e2) => e1[1] - e2[1]);
}

console.log(buildTimeline(getPerformanceEntries()));
