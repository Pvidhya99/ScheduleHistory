import {access_token, BASE_URL_1, BASE_URL, BASE_URL_2, students} from './constants';
import PropTypes from "prop-types";


export function getAccessToken(username, password) {
    let promise = fetch(BASE_URL + '/oauth/token?grant_type=password&username=' + username + '&password=' + password, {
        method: 'post',
        headers: {
            'Authorization': 'Basic ' + btoa('my-trusted-client:secret'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return promise;

}

export function sendPasswordResetLink(data) {
    let promise = fetch(BASE_URL_1 + '/forgotPassword', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    return promise;

}

export function accessWithRefreshToken(action, url, body, headers) {
    //alert('came to refresh')
    let refresh_token = sessionStorage.getItem('refresh_token')
    console.log('refresh_token', refresh_token)
    console.log(new Date().getTime());
    return new Promise((resolve) => {
        fetch('https://devapi3.mealmanage.com/oauth/token?grant_type=refresh_token&refresh_token=' + refresh_token, {
            method: 'post',
            headers: {
                'Authorization': 'Basic ' + btoa('my-trusted-client:secret'),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            console.log('response of refresh', response);
            if (!response.ok) {
                alert('Your Session has expired');
                sessionStorage.clear();
                window.location.replace('/login');
                throw Error(response.statusText);
            }
            return response.json();
        }).then(result => {
            console.log('data of refresh', result);
            sessionStorage.setItem('access_token', result.access_token);
            sessionStorage.setItem('refresh_token', result.refresh_token);
            console.log('access', sessionStorage.getItem('access_token'));
            console.log(new Date().getTime());
            switch (action) {
                case 'get':
                    //alert('came here to switch get');
                    resolve(get(url));
                    break;
                case 'post':
                    //alert('came here to switch post');
                    resolve(post(url, body));
                    break;
                case 'put':
                    //alert('came here to switch put');
                    resolve(put(url, body));
                    break;
                case 'del':
                    //alert('came here to switch del');
                    resolve(_delete(url));
                    break;
                case 'postWithHeaders':
                    //alert('came here to switch postWithHeaders');
                    resolve(postWithHeaders(url, body, headers));
                    break;
                case 'patch':
                    //alert('came here to switch patch');
                    resolve(patch(url, body));
                    break;

            }

        }).catch(
            (error) => {
                console.log(' response', error)
            });
    })

}

export function get(url,reqAccessToken=true) {
    //alert('came to get it')
    return new Promise((resolve) => {
        let fullurl=(reqAccessToken)?BASE_URL_2 + url + access_token():BASE_URL_2 + url;
        fetch(fullurl, {
            method: 'get'
        }).then(response => {
            console.log('get response', response);
            if (response.status === 401) {
                resolve(accessWithRefreshToken('get', url));
            }
            else resolve(response);
        })
    })

}

export function post(url, body) {
    //alert('came to post it')
    return new Promise((resolve) => {
        fetch(BASE_URL_2 + url + access_token(), {
            method: 'post',
            body: body,
        }).then(response => {
            console.log('post response', response);
            if (response.status === 401) {
                resolve(accessWithRefreshToken('post', url, body));
            }
            else resolve(response);
        });
    });
}


export function postWithHeaders(url, body, headers) {
    //alert('came to post it')
    return new Promise((resolve) => {
        fetch(BASE_URL_2 + url + access_token(), {
            method: 'post',
            body: body,
            headers:headers
        }).then(response => {
            console.log('postWithHeaders response', response);
            if (response.status === 401) {
                resolve(accessWithRefreshToken('postWithHeaders', url, body, headers));
            }
            else resolve(response);
        });
    });
}

export function patch(url, body) {
    //alert('came to post it')
    return new Promise((resolve) => {
        fetch(BASE_URL_2 + url + access_token(), {
            method: 'PATCH',
            body: body,
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
            }
        }).then(response => {
            console.log('patch response', response);
            if (response.status === 401) {
                resolve(accessWithRefreshToken('patch', url, body));
            }
            else resolve(response);
        });
    });
}

export function put(url, body) {
    //alert('came to post it')
    return new Promise((resolve) => {
        fetch(BASE_URL_2 + url + access_token(), {
            method: 'put',
            body: body,
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
            }
        }).then(response => {
            console.log('put response', response);
            if (response.status === 401) {
                resolve(accessWithRefreshToken('put', url, body));
            }
            else resolve(response);
        });
    });
}


export function _delete(url) {
    //alert(url);
    return new Promise((resolve) => {
        fetch(BASE_URL_2 + url + access_token(), {
            method: 'delete'
        }).then(response => {
            console.log('delete response', response);
            if (response.status === 401) {
                resolve(accessWithRefreshToken('del', url));
            }
            else resolve(response);
        });
    });
}
