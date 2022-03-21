async function authenticate(username, password){
    return await fetch('http://localhost:3000/users').then(resp=>resp.json()).then(users=>{
        return users.find(user => user.username == username && user.password == password);
    });
}

async function products(){
    return await fetch('http://localhost:3000/products').then(resp => resp.json());
}