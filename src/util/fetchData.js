export function get(url) {
    return axios.get(uri).then(response => response.data);
}
