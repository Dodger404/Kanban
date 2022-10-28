import axios from "axios";

const instance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/posts/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});

const request = function (options) {
  const onSuccess = function (response) {
    return response.data;
  };

  const onError = function (error) {
    return Promise.reject(error);
  };

  return instance(options)
    .then(onSuccess)
    .catch(onError);
};

export default request;
