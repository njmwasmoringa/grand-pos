const data = {
    "products":[
        {
            "name":"Milk",
            "qty":100,
            "price": 55,
            "code":2098230948023
        },
        {
            "name":"Bread",
            "qty":100,
            "price": 50,
            "code":97984569896787
        },
        {
            "name":"Soap",
            "qty":100,
            "price": 120,
            "code":8798234092392093
        },
        {
            "name":"Tissue Paper",
            "qty":100,
            "price": 85,
            "code":948792399458374
        },
        {
            "name":"1kg Rice",
            "qty":100,
            "price": 120,
            "code":898756645343
        },
        {
            "name":"2kg Sugar",
            "qty":100,
            "price": 220,
            "code":65784596782482
        }
    ],

    "users":[
        {
            "name": "Administrator",
            "username": "admin",
            "password":"@dm1n"
        }
    ]
}

async function authenticate(username, password){
    return new Promise(rs=>{
        setTimeout(()=>{
            rs(data.users.find(user => user.username == username && user.password == password));
        }, 1000);
    });
    /* return await fetch('db.json').then(resp=>resp.json()).then(json=>{
        return json.users.find(user => user.username == username && user.password == password);
    }); */
}

async function products(){
    return new Promise(rs=>{
        setTimeout(()=>{
            rs(data.products);
        }, 1000);
    });
    /* return await fetch('db.json').then(resp => resp.json()).then(json=>json.products); */
}