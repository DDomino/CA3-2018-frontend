const URL = "http://localhost:8084/jwtbackend";

function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
}

class ApiFacade {
  

  setToken = token => {
    localStorage.setItem("jwtToken", token);
  };
  getToken = () => {
    return localStorage.getItem("jwtToken");
  };
  loggedIn = () => {
    const loggedIn = this.getToken() != null;
    return loggedIn;
  };
  logout = () => {
    localStorage.removeItem("jwtToken");
  };

  login = (user, pass) => {
    const options = this.makeOptions("POST", true, {
      username: user,
      password: pass
    });
    return fetch(URL + "/api/login", options, true)
      .then(handleHttpErrors)
      .then(res => {
        this.setToken(res.token);
      });
  };


  fetchAllSpaceships = () => {
    const options = this.makeFetchOptions("GET");
    return fetch(URL + "/api/info/spaceships", options, true)
      .then(handleHttpErrors)
  }
  fetchAllPersons = () => {
    const options = this.makeFetchOptions("GET");
    return fetch(URL + "/api/info/people", options, true)
      .then(handleHttpErrors)
  }
  fetchAllPlanets = () => {
    const options = this.makeFetchOptions("GET");
    return fetch(URL + "/api/info/planets", options, true)
      .then(handleHttpErrors)
  }


  makeOptions(method, addToken, body) {
    var opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json"
      }
    };
    if (addToken && this.loggedIn()) {
      opts.headers["x-access-token"] = this.getToken();
    }
    if (body) {
      opts.body = JSON.stringify(body);
    }
    return opts;
  }
}
const facade = new ApiFacade();
export default facade;
