import { html } from '@popeindustries/lit-html-server';

export default (year, month, day) => {
  return html`
    ${ year && month && day ? html`
      <div class="date">
        ${monthFormat(month)}
        ${day}
        <span class="number-suffix">${suffix(day)}</span>,
        year ${year} J.C.
      </div>
    `: ''}
  `
};

function monthFormat(month) {
    return month.match(/\d{1,2}: (.*)$/)[1];
}

function suffix(number) {
    return {
        '1': 'st',
        '2': 'nd',
        '3': 'rd',
        '4': 'th',
        '5': 'th',
        '6': 'th',
        '7': 'th',
        '8': 'th',
        '9': 'th',
        '0': 'th',
    }[number.toString().split('').pop()]
}