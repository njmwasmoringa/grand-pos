async function authenticate(username, password){
    return await fetch('https://njmwasmoringa.github.io/grand-pos/db.json').then(resp=>resp.json()).then(json=>{
        return json.users.find(user => user.username == username && user.password == password);
    });
}

async function products(){
    return await fetch('https://njmwasmoringa.github.io/grand-pos/db.json').then(resp => resp.json()).then(json=>json.products);
}