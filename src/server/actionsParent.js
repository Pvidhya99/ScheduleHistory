import {access_token, BASE_URL, BASE_URL_2,webURL} from './constants';

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

export function genAccessToken(action, url, body, headers) {
    //alert('came to refresh')
    let userName = sessionStorage.getItem('loggedInUserInfo')
    console.log('loggedInUserInfo', userName)
    let fToken = sessionStorage.getItem('ftoken')
    console.log('ftoken', fToken)
    return new Promise((resolve) => {
        fetch(BASE_URL + '/oauth/token?grant_type=password&username=' + userName + '&password=' + fToken, {
            method: 'post',
            headers: {
                'Authorization': 'Basic ' + btoa('my-trusted-client:secret'),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            if (!response.ok) {
                alert('Something went wrong, Request for new access link if this repeats !')
                window.location.replace('/activateParentAccount');
                throw Error(response.statusText);
            }
            //console.log('response', response);
            // this.setToken(response.token); // Setting the token in sessionStorage
            return response.json();
        }).then(respData => {
            sessionStorage.setItem('access_token', respData.access_token);
            sessionStorage.setItem('refresh_token', respData.refresh_token);
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
                default :
                   

            }

        }).catch(
            (error) => {
                console.log(' response', error)
            });
    })

}

export function get(url, reqAccessToken = true,isWebsite=false) {
    //alert('came to get it')
    return new Promise((resolve) => {
        let fullurl = (reqAccessToken) ? BASE_URL_2 + url + access_token() : BASE_URL_2 + url;
        if(isWebsite){
            fullurl=webURL+url;
        }
        fetch(fullurl, {
            method: 'get'
        }).then(response => {
            console.log('get response', response);
            if (response.status === 401) {
                resolve(genAccessToken('get', url));
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
            headers: {'Content-Type' : 'application/json'},
            body: body,
        }).then(response => {
            console.log('post response', response);
            if (response.status === 401) {
                resolve(genAccessToken('post', url, body));
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
            headers: headers
        }).then(response => {
            console.log('postWithHeaders response', response);
            if (response.status === 401) {
                resolve(genAccessToken('postWithHeaders', url, body, headers));
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
                resolve(genAccessToken('patch', url, body));
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
                resolve(genAccessToken('put', url, body));
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
                resolve(genAccessToken('del', url));
            }
            else resolve(response);
        });
    });
}


export function validateParentAccount(data) {

    return new Promise((resolve) => {
        let url='/validateParent';
        fetch(BASE_URL_2 + url, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log('post response', response);
            resolve(response);
        });
    });
}


export function getStudentSchoolInfo(url) {
    let promise = fetch(url + '?access_token=' + access_token(), {
        method: 'get'
    });
    return promise;
}



