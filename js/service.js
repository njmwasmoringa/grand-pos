async function authenticate(username, password){
    return await fetch('../db.json').then(resp=>resp.json()).then(json=>{
        return json.users.find(user => user.username == username && user.password == password);
    });
}

async function products(){
    return await fetch('../db.json').then(resp => resp.json()).then(json=>json.products);
}