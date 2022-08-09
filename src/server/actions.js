import {access_token, BASE_URL, BASE_URL_1, BASE_URL_2} from './constants';
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
                if(sessionStorage.length>0){
                    alert('Your Session has expired');
                    sessionStorage.clear();
                    window.location.replace('/login');
                }                
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
                case 'postWithHeadersResponse':
                    resolve(postWithHeadersResponse(url, body, headers));
                    break;
                case 'postResponse':
                    resolve(postResponse(url, body));
                    break
                case 'putWithHeadersResponse':
                    resolve(putWithHeadersResponse(url, body, headers));
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

export function get(url, reqAccessToken = true) {
    //alert('came to get it')
    return new Promise((resolve) => {
        let fullurl = (reqAccessToken) ? BASE_URL_2 + url + access_token() : BASE_URL_2 + url;
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
            headers: headers
        }).then(response => {
            console.log('postWithHeaders response', response);
            if (response.status === 401) {
                resolve(accessWithRefreshToken('postWithHeaders', url, body, headers));
            }
            else resolve(response);
        });
    });
}
export function postWithHeadersResponse(url, body, headers) {
    //alert('came to post it')
    return new Promise((resolve) => {
        fetch(BASE_URL_2 + url + access_token(), {
            method: 'post',
            body: body,
            headers: headers
        }).then(response => {
            console.log('postWithHeaders response', response);
            if (response.status === 401) {
                resolve(accessWithRefreshToken('postWithHeaders', url, body, headers));
            }
            else resolve(response.json());
        },error=>{
            resolve(error.json());
        });
    });
}
export function postResponse(url, body) {
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
            else resolve(response.json());
        },error=>{
            resolve(error.json())
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
export function putWithHeadersResponse(url, body,headers) {
    //alert('came to post it')
    return new Promise((resolve) => {
        fetch(BASE_URL_2 + url + access_token(), {
            method: 'put',
            body: body,
            headers: headers
        }).then(response => {
            console.log('put response', response);
            if (response.status === 401) {
                resolve(accessWithRefreshToken('putWithHeadersResponse', url, body,headers));
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

export function activateMail(mail) {
//https://devapi.mealmanage.com/mealManage /activateAccount?emailId=pankaj.kumar@techmileage.com&access_token=09832d99-4e59-474e-86d8-50cf813c557e
    let promise = fetch(BASE_URL_1 + '/activateAccount?emailId=' + mail + '&access_token=' + access_token(), {
        method: 'GET'
    });
    return promise;
}

export function getUserBySchoolId(id) {

    let promise = fetch(BASE_URL_1 + '/school/' + id + '/users/', {
        method: 'put'
    });
    return promise;
}

//https://devapi.mealmanage.com/mealManage/login/227?access_token=c1383c01-a324-43ec-b68c-2224492411c5
export function findUser(schoolId) {

    let promise = fetch(BASE_URL_1 + '/login/' + schoolId + '?access_token=' + access_token(), {
        method: 'GET'
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

export function resetPassword(data) {
    let promise = fetch(BASE_URL_1 + '/recoveryPassword', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    return promise;

}

export function getSchoolstoOnboard() {
    console.log("Inside get school list action");

    let promise = fetch(BASE_URL_1 + '/schoolWithDistrict?boardedType=NotBoarded&access_token=' + access_token(), {
        method: 'get'
    });
    return promise;
}

export function getSchools() {
    console.log("Inside get school list action");
    let promise = fetch(BASE_URL_1 + '/schoolWithDistrict?boardedType=OnBoarded&access_token=' + access_token(), {

        method: 'get'
    });
    return promise;
}

export function getSchoolDistricts() {
    let promise = fetch(BASE_URL_1 + '/schoolDistricts?access_token=' + access_token(), {
        method: 'get'
    });
    return promise;
}

//https://devapi.mealmanage.com/mealManage/school/search/findBySubdomian?subdomain=cvs&access_token=a1439bc2-d3e5-4ce0-abd7-b22953a1cae8
export function findBySchoolSubDomain(subDomain) {
    let promise = fetch(BASE_URL_1 + '/school/search/findBySubdomian?subdomain=' + subDomain + '&access_token=' + access_token(), {
        method: 'get'
    });
    return promise

}

export function findSchoolByDistrict(districtId) {
    let promise = fetch(BASE_URL_1 + '/school/search/findBySchoolDistrictId?schoolDistrictId=' + districtId, {
        method: 'get'
    });
    return promise;
}

export function registerSchool(schoolData) {
    let promise = fetch(BASE_URL_1 + '/users?access_token=' + access_token(), {
        method: 'post',
        body: JSON.stringify(schoolData),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    return promise;
}

export function storeSchoolInfo(id) {
    let promise = fetch(BASE_URL_1 + '/school/' + id, {
        method: 'get'
    });
    return promise;
}

export function findByMail(mail) {
    let promise = fetch(BASE_URL_2 + '/usersAuthInfoes/search/validateUserName?username=' + mail, {
        method: 'get'
    });
    return promise;

}


export function saveHoliday(holidayInfo) {
    let promise = fetch(BASE_URL_1 + '/holidays?access_token=' + access_token(), {
        method: 'post',
        body: JSON.stringify(holidayInfo),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    return promise;

}

export function deleteStudent(url) {
    let promise = fetch(url + '?access_token=' + access_token(), {
        method: 'post'
    });
    return promise;
}

export function deleteHoliday(holidayId) {
    let promise = fetch(BASE_URL_1 + '/holidays/' + holidayId + '?access_token=' + access_token(), {
        method: 'delete'
    });
    return promise;
}


export function updateHoldiay(holidayInfo) {
    let promise = fetch(BASE_URL_1 + '/holidays/' + holidayInfo.holidayId + '?access_token=' + access_token(), {
        method: 'put',
        body: JSON.stringify(holidayInfo),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    return promise;

}


export function getAdminBySchoolId(schoolId) {
    let promise = fetch(BASE_URL_1 + '/school/' + schoolId + '/users', {
        method: 'get'
    });
    return promise;
}


export function saveStudents(data) {
    let promise = fetch(BASE_URL_1 + '/student', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    return promise;

}

export function getHolidays(schoolId) {
    let promise = fetch(BASE_URL_1 + '/holidays/search/findBySchoolId?schoolId=' + schoolId + '&access_token=' + access_token(), {
        method: 'get'
    });
    return promise;

}

export function getSchoolData(schoolId) {
    let promise = fetch(BASE_URL_1 + '/student/search/findBySchoolId?schoolId=' + schoolId + '&access_token=' + access_token(), {
        method: 'get'
    });
    return promise;
}

export function getDeletedStudents(schoolId) {
    let promise = fetch(BASE_URL_1 + '/inactiveStudents?schoolId=' + schoolId + '&access_token=' + access_token(), {
        method: 'get'
    });
    return promise;
}

export function restoreStudents(id) {
    let promise = fetch(BASE_URL_1 + '/student/' + id + '?access_token=' + access_token(), {
        method: 'PATCH',
        body: JSON.stringify({
            "isActive": true
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    return promise;
}

export function getStudentByGrade(schoolId, gradeId) {
    let promise = fetch(BASE_URL_1 + '/student/search/findBySchoolIdAndGradeId?schoolId=' + schoolId + '&gradeId=' + gradeId + '&access_token=' + access_token(), {
        method: 'get'
    });
    return promise;

}

export function getSchoolGrades(schoolId) {
    let promise = fetch(BASE_URL_1 + '/typeGradeBySchlId?schoolId=' + schoolId + '&access_token=' + access_token(), {
        method: 'get'
    });
    return promise;

}

export function addStudents(data) {
    let promise = fetch(BASE_URL_1 + '/students?access_token=' + access_token(), {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    return promise;

}

export function uploadSchoolData(data, schoolId, userName) {
    let promise = fetch(BASE_URL_1 + '/importStudents?schoolId=' + schoolId + '&loggedUser=' + userName + '&access_token=' + access_token(), {
        method: 'post',
        body: data,

    });
    return promise;

}

export function mealJson(data) {
    let promise = fetch(BASE_URL_2 + '/mealJson?access_token=' + access_token(), {
        method: 'post',
        body: data,

    });
    return promise;


}



export function requestOTP(data) {
   
    return new Promise((resolve) => {
        let url='/generateOTP?access_token=';
        fetch(BASE_URL_2 + url + access_token(), {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log('post response', response);
            if (response.status === 401) {
                resolve(accessWithRefreshToken('post', url, JSON.stringify(data)));
            }
            else resolve(response);
        });
    });
}

export function validateOTP(data) {
    return new Promise((resolve) => {
        let url='/validateOTP?access_token=';
        fetch(BASE_URL_2 + url + access_token(), {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log('post response', response);
            if (response.status === 401) {
                resolve(accessWithRefreshToken('post', url, JSON.stringify(data)));
            }
            else resolve(response);
        });
    });
}

export function getStudentsByParent(parentEmailId) {
    return new Promise((resolve) => {
        let url='/studentUsers/search/findByEmail?username=' + parentEmailId + '&access_token='
       fetch(BASE_URL_2 + url + access_token(), {
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

export function getStudentSchoolInfo(url) {
    let promise = fetch(url + '?access_token=' + access_token(), {
        method: 'get'
    });
    return promise;
}



