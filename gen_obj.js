var list = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','MD','MI','NJ',
            'NY','OH','PA','UT','TX','WA'];
function randomGenLoc(list) {
    var res = [];
    var temp_arr = list;
    for (var i = 0; i<3; i++) {
        var arrIndex = Math.floor(Math.random()*temp_arr.length);
        res[i] = temp_arr[arrIndex];
    }
    return res;
}
var batchs = ["UI", "Java", "JS"];
var emp_cpy = ["google","facebook", "linkedIn"];
var emp_pos = ["Computer Programmer", "Front end developer", "Software Engineer"];
var users = [];
for(var i = 0; i < 100; i++)
{
    var user = {
        "firstname": "user_" + i + "_firstname",
        "lastname": "user_" + i + "_lastname",
        "email": "user" + i + "@google.com",
        "location": randomGenLoc(list),
        "phone": (Math.floor(Math.random()*1000000000)).toString(),
        "batch": batchs[Math.floor(Math.random()*batchs.length)],
        "address": {
            "communication": "Google, " +list[Math.floor(Math.random()*list.length)],
            "permanent": "Google, "+list[Math.floor(Math.random()*list.length)]
        },
        "previous_employer": emp_cpy[Math.floor(Math.random()*emp_cpy.length)] + ": "
                            + emp_pos[Math.floor(Math.random()*emp_pos.length)],
    };
    users.push(user);
};

var fs = require("fs");

fs.writeFile('data.json', JSON.stringify(users), function(err) {
    if (err) {
        return console.error(err);
    }
    console.log("数据写入成功！");
});
