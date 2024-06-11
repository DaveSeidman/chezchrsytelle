export const listToString = array => array.join(', ').replace(/\,(?=[^,]*$)/, ' and');

export const api = location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://api.chezchrystelle.com';
