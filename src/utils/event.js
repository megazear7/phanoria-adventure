export function orderEvents(events) {
    events.sort((aItem, bItem) => {
        const a = aItem.fields;
        const b = bItem.fields;
        const months = [
            '1: January',
            '2: February',
            '3: March',
            '4: April',
            '5: May',
            '6: June',
            '7: July',
            '8: August',
            '9: September',
            '10: October',
            '11: November',
            '12: December',
        ];
        if (b.year != a.year) {
            return b.year - a.year;
        } else if (b.month != a.month) {
            return months.indexOf(b.month) - months.indexOf(a.month);
        } else if (b.day != a.day) {
            return b.day - a.day;
        }
        return a.ordering - b.ordering;
    });

    return events;
}