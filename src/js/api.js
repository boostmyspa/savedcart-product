import axios from 'axios';

const BASE_URL            = 'https://glamourbabyboutique.com';
const IMAGES_API          = `${BASE_URL}/api-cart/images`;
const ORIGINAL_IMAGES_API = `${BASE_URL}/pdo`;
const CONTEXT_API         = `${BASE_URL}/products/:slug/api-context`;

export async function getImage(id) {
	return axios.get(`${ORIGINAL_IMAGES_API}/${id}`, {responseType: 'blob'})
		.then(({data}) => data);
}

export async function buy(slug, items) {
	return axios.post(CONTEXT_API.replace(':slug', slug), items)
		.then(({data}) => data);
}

export async function uploadImage(file) {
	const data = new FormData();
	data.append('image', file);
	
	return axios.post(IMAGES_API, data)
		.then(({data: {id}}) => id);
}
