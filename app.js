window.onload = function () {
    var users=[];
    jQuery.ajax({
        type: "GET",
        url: "http://127.0.0.1:8080/Assignment/StudentManagementSystem/data.json",
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

            var html = "";

            var length = document.getElementById("select").value;

            // show 10 lines
            for(var i=0; i<length; i++){
                html += `
                    <tr id="tr_${i}">
                        <td>${data[i].firstname}</td>
                        <td>${data[i].lastname}</td>
                        <td>${data[i].email}</td>
                        <td>${data[i].location}</td>
                        <td>${data[i].phone}</td>
                        <td>${data[i].batch}</td>
                        <td>${data[i].address.communication}</td>
                        <td>
                            <button id="view_btn_${i}">More Detail</button>
                            <button id="edit_btn_${i}">Edit</button>
                            <button id="del_btn_${i}">Delete</button>
                        </td>
                    </tr>`;
            };
            jQuery("#tr_hdr").after(html);
        },
        error: function (err) {
            console.log(err);
        }
    });

    document.getElementById("select").addEventListener("change",function () {
        var length = document.getElementById("select").value;
        var html = "";

        $("#tbl tr").slice(1).remove();

        // show n lines
        for(var i=0; i<length; i++){
            html += `
                    <tr id="tr_${i}">
                        <td>${JSON.parse(localStorage.a_users)[i].firstname}</td>
                        <td>${JSON.parse(localStorage.a_users)[i].lastname}</td>
                        <td>${JSON.parse(localStorage.a_users)[i].email}</td>
                        <td>${JSON.parse(localStorage.a_users)[i].location}</td>
                        <td>${JSON.parse(localStorage.a_users)[i].phone}</td>
                        <td>${JSON.parse(localStorage.a_users)[i].batch}</td>
                        <td>${JSON.parse(localStorage.a_users)[i].address.communication}</td>
                        <td>
                            <button id="view_btn_${i}">More Detail</button>
                            <button id="edit_btn_${i}">Edit</button>
                            <button id="del_btn_${i}">Delete</button>
                        </td>
                    </tr>`;
        };
        jQuery("#tr_hdr").after(html);
    });
};

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
        });
    }
});

jQuery(document).on('click', 'button[id^="del_btn_"]', function () {
    var tr_id = jQuery(this).attr('id').replace('del_btn_', 'tr_');
    var tr_details = tr_id.replace('tr_', 'tr_details_');
    var id = tr_id.replace('tr_', '');

    var users_local = JSON.parse(localStorage.a_users);
    users_local.splice(id, 1);
    localStorage.a_users = JSON.stringify(users_local);

    jQuery("#"+tr_id).remove();
    jQuery("tr[id=" + tr_details +"]").remove();
});

jQuery(document).on('click', 'button[id="add"]', function () {
    var firstname_add = jQuery("#add_form #firstname").val();
    var lastname_add = jQuery("#add_form #lastname").val();
    var email_add = jQuery("#add_form #email").val();
    var location_add = jQuery("#add_form #location").val();
    location_add = location_add.split(",");
    var phone_add = jQuery("#add_form #phone").val();
    var batch_add = jQuery("#add_form #batch").val();
    var communication_add = jQuery("#add_form #communication").val();
    var permanent_add = jQuery("#add_form #permanent").val();
    var previous_employer_add = jQuery("#add_form #previous_employer").val();

    var users_local = JSON.parse(localStorage.a_users);
    users_local.push({
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
    });
    localStorage.a_users = JSON.stringify(users_local);
});
