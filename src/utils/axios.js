const axios = require('axios');
axios.defaults.withCredentials = true;
const { URL_API } = require('../config.js');
const urlBase = URL_API;

// 'Content-Type': 'application/json',
// 'Content-Type': 'multipart/form-data',
// 'Content-Type': 'application/x-www-form-encoded',

/**
 * @param {string} $url url a la cual consultar
 * esta funcion detecta si es una nueva url base (comienza con http:// o https://).
 * en caso de ser así, retorna la url. en caso contrario, se asume que es un fragmento
 * de path por lo que se concatena con la constante urlBase
 **/
const readUrl = (url = '') =>
	url.startsWith('http://') || url.startsWith('https://') ? url : `${urlBase}${url}`

const headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json',
}

const get = (url = '', options = {}) => axios.get(readUrl(url), {
	headers: {
		...headers,
		...options.headers
	},
	...options
});

const apiGet = (url = '', options = {}) => get(`${URL_API}${url}`, options);

const post = (url = '', body = {}, options = {}) => axios.post(readUrl(url), body, {
	headers: {
		'Content-Type': 'multipart/form-data',
		...options.headers
	},
	...options
})

const apiPost = (url = '', body = {}, options = {}) => post(`${URL_API}${url}`, body, options);

const put = (url = '', body = {}, options = {}) => axios.put(readUrl(url), body, {
	headers: {
		...headers,
		...options.headers
	},
	...options
})

const del = (url = '', headers = {}) => axios.delete(readUrl(url), {
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		...headers
	}
})

export default {
	apiPost,
	apiGet,
	get,
	post,
	put,
	delete: del,
}