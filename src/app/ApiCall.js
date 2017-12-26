const ApiCalls = {

  getApiCall(url, authToken) {
    let base_url = "http://api.eventsacross-stage.railsfactory.com/api/";
    let fetch_url = base_url + url;
    let headers = {
      "Content-Type": "application/json"
    }
    if(authToken){
      headers["Authorization"] = authToken;
    }
    return fetch(fetch_url, {
      method: "GET",
      headers: headers
    })
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    })
    .then(function(json) {
      return json;
     })
  },

  postApiCall(url, data, authToken) {
    let base_url = "http://api.eventsacross-stage.railsfactory.com/api/";
    let fetch_url = base_url + url;
    let headers = {
      "Content-Type": "application/json"
    }
    if(authToken){
      headers["Authorization"] = authToken;
    }
    return fetch(fetch_url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: headers
    })
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    })
    .then(function(json) {
      return json;
     })
  }

}

export default ApiCalls;
