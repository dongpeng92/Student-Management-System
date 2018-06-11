function throttle(fn, wait) {
    var time = Date.now();
    return function() {
        if ((time + wait - Date.now()) < 0) {
            fn();
            time = Date.now();
        }
    }
}

var showAll = function () {
    var html = "";
    // var users=[];

    var select_len = document.getElementById("select").value;
    // 已经加载了多少个
    var offset = jQuery("#tbl tr").slice(1).length;

    // users = JSON.parse(localStorage.a_users);

    // make it asyn to syn
    var p = new Promise(function(resolve, reject){
        resolve(localStorage.a_users);
    });
    p.then(function (data) {
        users = JSON.parse(data);
    });

    // show 10 lines
    for(var i=0; i<select_len && (i+offset) < users.length; i++){
        html += `
                    <tr id="tr_${i+offset}">
                        <td>${JSON.parse(localStorage.a_users)[i+offset].firstname}</td>
                        <td>${JSON.parse(localStorage.a_users)[i+offset].lastname}</td>
                        <td>${JSON.parse(localStorage.a_users)[i+offset].email}</td>
                        <td>${JSON.parse(localStorage.a_users)[i+offset].location}</td>
                        <td>${JSON.parse(localStorage.a_users)[i+offset].phone}</td>
                        <td>${JSON.parse(localStorage.a_users)[i+offset].batch}</td>
                        <td>${JSON.parse(localStorage.a_users)[i+offset].address.communication}</td>
                        <td>
                            <button id="view_btn_${i+offset}">More Detail</button>
                            <button id="edit_btn_${i+offset}">Edit</button>
                            <button id="del_btn_${i+offset}">Delete</button>
                        </td>
                    </tr>`;
    };
    // jQuery("#tr_hdr").after(html);
    document.getElementById("tbl").insertAdjacentHTML('beforeend', html);
}

function showSearch(users) {
    var html = "";

    for(var i=0; i<users.length; i++){
        html += `
                    <tr id="tr_${i}">
                        <td>${users[i].firstname}</td>
                        <td>${users[i].lastname}</td>
                        <td>${users[i].email}</td>
                        <td>${users[i].location}</td>
                        <td>${users[i].phone}</td>
                        <td>${users[i].batch}</td>
                        <td>${users[i].address.communication}</td>
                        <td>
                            <button id="view_btn_${i}">More Detail</button>
                            <button id="edit_btn_${i}">Edit</button>
                            <button id="del_btn_${i}">Delete</button>
                        </td>
                    </tr>`;
    };
    jQuery("#tr_hdr").after(html);
}

function refreshTable() {
    jQuery("#tbl tr").slice(1).remove();
    showAll();
}

window.onload = function () {
    // scroll function
    window.addEventListener('scroll', scroll);

    var users=[];
    if(!localStorage.a_users){
        jQuery.ajax({
            type: "GET",
            url: "http://127.0.0.1:8080/Assignment/Student%20Management%20System/data.json",
            success: function (data) {
                var len = data.length;

                // write into localStorage
                for(var i=0; i<len; i++) {
                    var user = {
                        'firstname': data[i].firstname,
                        'lastname': data[i].lastname,
                        'email': data[i].email,
                        'location': data[i].location,
                        'phone': data[i].phone,
                        'batch': data[i].batch,
                        'address': data[i].address,
                        'previous_employer': data[i].previous_employer
                    };
                    users.push(user);
                }
                localStorage.a_users = JSON.stringify(users);
            },
            error: function (err) {
                console.log(err);
            }
        });
    }

    showAll();
    showAll = throttle(showAll, 1000);
};

//select diff items
document.getElementById("select").addEventListener("change",function () {
    refreshTable();

    // scroll function
    window.addEventListener('scroll', scroll);
});

// scroll function
function scroll() {
    var scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    if ( (scrollY + window.innerHeight) >= (document.body.offsetHeight - 20)) {
        showAll();
    }
}
// view button
jQuery(document).on('click', 'button[id^="view_btn_"]', function () {
    var tr_id = jQuery(this).attr('id').replace('view_btn_', 'tr_');
    var tr_details = tr_id.replace('tr_', 'tr_details_');
    var id = tr_id.replace('tr_', '');

    if(jQuery("tr[id=" + tr_details +"]").length == 0) {
        jQuery("#"+tr_id).after(`
        <tr id="${tr_details}">
            <td colspan="10">
                <label>Firstname:</label><input value="${JSON.parse(localStorage.a_users)[id].firstname}" readonly="readonly" />
                <label>Lastname:</label><input value="${JSON.parse(localStorage.a_users)[id].lastname}" readonly="readonly" /><br />
                <label>Email:</label><input value="${JSON.parse(localStorage.a_users)[id].email}" readonly="readonly" />
                <label>Location:</label><input value="${JSON.parse(localStorage.a_users)[id].location}" readonly="readonly" />
                <label>Phone:</label><input value="${JSON.parse(localStorage.a_users)[id].phone}" readonly="readonly" />
                <label>Batch:</label><input value="${JSON.parse(localStorage.a_users)[id].batch}" readonly="readonly" /><br />
                <label>Address: </label><span>Communication address: <input value="${JSON.parse(localStorage.a_users)[id].address.communication}" readonly="readonly" /></span>
                                        <span>Permanent address: <input value="${JSON.parse(localStorage.a_users)[id].address.permanent}" readonly="readonly" /></span><br />
                <label>Previous Employer:</label><input style="width:200px" value="${JSON.parse(localStorage.a_users)[id].previous_employer}" readonly="readonly"/>
            </td>
        </tr>
        `);
    } else {
        jQuery("tr[id=" + tr_details +"]").remove();
    }
});

// edit button
jQuery(document).on('click', 'button[id^="edit_btn_"]', function () {
    var tr_id = jQuery(this).attr('id').replace('edit_btn_', 'tr_');
    var tr_details = tr_id.replace('tr_', 'tr_details_');
    var id = tr_id.replace('tr_', '');
    var btn_edit_id = tr_id.replace('tr_', 'btn_edit_');
    jQuery("tr[id=" + tr_details +"]").remove();

    if(jQuery("tr[id=" + tr_details +"]").length == 0) {
        jQuery("#"+tr_id).after(`
        <tr id="${tr_details}">
            <td colspan="10">
                <label>Firstname:</label><input id="firstname" value="${JSON.parse(localStorage.a_users)[id].firstname}" />
                <label>Lastname:</label><input id="lastname" value="${JSON.parse(localStorage.a_users)[id].lastname}" /><br />
                <label>Email:</label><input id="email" value="${JSON.parse(localStorage.a_users)[id].email}" />
                <label>Location:</label><input id="location" value="${JSON.parse(localStorage.a_users)[id].location}" />
                <label>Phone:</label><input id="phone" value="${JSON.parse(localStorage.a_users)[id].phone}" />
                <label>Batch:</label><input id="batch" value="${JSON.parse(localStorage.a_users)[id].batch}" /><br />
                <label>Address: </label><span>Communication address: <input id="communication" value="${JSON.parse(localStorage.a_users)[id].address.communication}" /></span>
                                        <span>Permanent address: <input id="permanent" value="${JSON.parse(localStorage.a_users)[id].address.permanent}" /></span><br />
                <label>Previous Employer:</label><input id="previous_employer" style="width:200px" value="${JSON.parse(localStorage.a_users)[id].previous_employer}" /><br />
                <button id="${btn_edit_id}">Save</button>
            </td>
        </tr>
        `);

        document.getElementById(btn_edit_id).addEventListener('click', function () {
            var firstname_new = jQuery("#"+tr_details + " #firstname").val();
            var lastname_new = jQuery("#"+tr_details + " #lastname").val();
            var email_new = jQuery("#"+tr_details + " #email").val();
            var location_new = jQuery("#"+tr_details + " #location").val();
            var phone_new = jQuery("#"+tr_details + " #phone").val();
            var batch_new = jQuery("#"+tr_details + " #batch").val();
            var communication_new = jQuery("#"+tr_details + " #communication").val();
            var permanent_new = jQuery("#"+tr_details + " #permanent").val();
            var previous_employer_new = jQuery("#"+tr_details + " #previous_employer").val();

            var users_local = JSON.parse(localStorage.a_users);
            users_local[id].firstname = firstname_new;
            users_local[id].lastname = lastname_new;
            users_local[id].email = email_new;
            users_local[id].location = location_new;
            users_local[id].phone = phone_new;
            users_local[id].batch = batch_new;
            users_local[id].address.communication = communication_new;
            users_local[id].address.permanent = permanent_new;
            users_local[id].previous_employer = previous_employer_new;

            localStorage.a_users = JSON.stringify(users_local);

            refreshTable();
        });
    }
});

// delete button
jQuery(document).on('click', 'button[id^="del_btn_"]', function () {
    var tr_id = jQuery(this).attr('id').replace('del_btn_', 'tr_');
    var tr_details = tr_id.replace('tr_', 'tr_details_');
    var id = tr_id.replace('tr_', '');

    var users_local = JSON.parse(localStorage.a_users);
    users_local.splice(id, 1);
    localStorage.a_users = JSON.stringify(users_local);

    jQuery("#"+tr_id).remove();
    jQuery("tr[id=" + tr_details +"]").remove();

    refreshTable();
});

// add user
jQuery(document).on('click', 'button[id="add"]', function () {
    var firstname_add = jQuery("#add_form #firstname").val();
    jQuery("#add_form #firstname").val("");
    var lastname_add = jQuery("#add_form #lastname").val();
    jQuery("#add_form #lastname").val("");
    var email_add = jQuery("#add_form #email").val();
    jQuery("#add_form #email").val("");
    var location_add = jQuery("#add_form #location").val();
    jQuery("#add_form #location").val("");
    location_add = location_add.split(",");
    var phone_add = jQuery("#add_form #phone").val();
    jQuery("#add_form #phone").val("");
    var batch_add = jQuery("#add_form #batch").val();
    jQuery("#add_form #batch").val("");
    var communication_add = jQuery("#add_form #communication").val();
    jQuery("#add_form #communication").val("");
    var permanent_add = jQuery("#add_form #permanent").val();
    jQuery("#add_form #permanent").val("");
    var previous_employer_add = jQuery("#add_form #previous_employer").val();
    jQuery("#add_form #previous_employer").val("");

    if(firstname_add && lastname_add && email_add) {
        var new_user = {
            firstname : firstname_add,
            lastname : lastname_add,
            email : email_add,
            location : location_add,
            phone : phone_add,
            batch : batch_add,
            address : {
                communication : communication_add,
                permanent : permanent_add
            },
            previous_employer : previous_employer_add
        };
        var users = JSON.parse(localStorage.a_users);
        users.unshift(new_user);
        localStorage.a_users = JSON.stringify(users);

        refreshTable();
    }

});

jQuery(document).on('click', 'button[id="search"]', function () {
    var key = jQuery("#keyword").val().toUpperCase();
    var users = JSON.parse(localStorage.a_users);
    var result = [];

    users.forEach(function (element) {
        if (element.firstname.toUpperCase().includes(key) || element.lastname.toUpperCase().includes(key) ||
            element.location.includes(key) || element.batch.toUpperCase().includes(key) ||
            element.phone.includes(key)) {
            result.push(element);
        }
    });

    $("#tbl tr").slice(1).remove();
    showSearch(result);
    window.removeEventListener('scroll', scroll, false);
});