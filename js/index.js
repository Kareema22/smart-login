


var signinEmailInput = document.getElementById('signinEmail');
var signinPasswordInput = document.getElementById('signinPassword');
var signinIncorrectInput = document.getElementById('incorrect');


var signupNameInput = document.getElementById('signupName');
var signupEmailInput = document.getElementById('signupEmail');
var signupPasswordInput = document.getElementById('signupPassword');
var signupExistInput = document.getElementById('exist');

var homeUsernameInput = document.getElementById('username');


var users = [];

loadLocalStorage()
displayUser();

function saveOnLocalStorage() {
    localStorage.setItem('users', JSON.stringify(users));
}

function loadLocalStorage() {
    if (localStorage.getItem('users') != null) {
        users = JSON.parse(localStorage.getItem('users'));
    }
}

function clearForm() {
    signupNameInput.value = null;
    signupEmailInput.value = null;
    signupPasswordInput.value = null;
}


function signUp() {
    var user = {
        name: signupNameInput.value,
        email: signupEmailInput.value,
        password: signupPasswordInput.value,
        loggedIn: false
    };

    if (!user.name) {
        alert("Name can't be empty")
        return
    }

    if (!user.email) {
        alert("Email can't be empty")
        return
    }

    if (!user.password) {
        alert("Password can't be empty")
        return
    }

    var existUserIndex = findByEmail(user.email)

    if (existUserIndex != -1) {
        if (user.password != signinPasswordInput.value) {
            signupExistInput.innerHTML = "User Already Exist";
            signupExistInput.style.color = 'red'
            return
        }
    }

    users.push(user);
    saveOnLocalStorage()
    clearForm();
    signupExistInput.innerHTML = "Success";
    signupExistInput.style.color = 'green'
}


function displayUser() {
    var loggedInUser = findLoggedIn();

    if (location.href.includes("home.html") && loggedInUser == -1) window.location.href = "./index.html"

    else if (location.href.includes("home.html") && loggedInUser != -1) {
        homeUsernameInput.innerHTML = "Welcome " + users[loggedInUser].name
        loadDataFromApi()
    }
}


function login() {
    var userIndex = findByEmail(signinEmailInput.value);

    if (userIndex == -1) {
        signinIncorrectInput.innerHTML = "User Not found"
        signinIncorrectInput.style.color = 'red'
        return
    }

    if (users[userIndex].password != signinPasswordInput.value) {
        signinIncorrectInput.innerHTML = "Invalid Password";
        signinIncorrectInput.style.color = 'red'
        return
    }

    console.log(userIndex)

    //remove all loggedIn flag
    users = users.map(user => ({ ...user, loggedIn: false }))

    //mark current user loggedIn
    users[userIndex].loggedIn = true;

    saveOnLocalStorage();

    window.location.href = "./home.html"
}


function logout() {
    var userIndex = findLoggedIn()

    users[userIndex].loggedIn = false;

    saveOnLocalStorage();
}

function findByEmail(email) {
    return users.findIndex(user => user.email == email)
}

function findLoggedIn() {
    return users.findIndex(user => user.loggedIn == true)
}


function loadDataFromApi() {
    let xhr = new XMLHttpRequest();
    let url = "https://forkify-api.herokuapp.com/api/search?q=ice cream";

    xhr.open("GET", url, true);

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var items = ''
            const data = JSON.parse(this.responseText)

            for (var i = 0; i < data.count - 1; i++) {
                items += `<div class="col-md-4 col-sm-6">
                <div class="  item ">
                  <img class="data-image w-100 " src="${data.recipes[i].image_url}">
                  <h4 class="h4 p-3"> ${data.recipes[i].title}</h2>
                </div>
                </div>`
            }
            document.getElementById('rowdata').innerHTML = items;
        }
    }
    xhr.send();
}