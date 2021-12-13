$(async function () {
    await getTableWithUsers();
    await getNewUserForm();
    await getDefaultModal();
    await addNewUser();
})

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAllUsers: async () => await fetch('api/users'),
    findOneUser: async (id) => await fetch(`api/users/${id}`),
    addNewUser: async (user) => await fetch('api/users', {method: 'POST', headers: userFetchService.head, body: JSON.stringify(user)}),
    updateUser: async (user, id) => await fetch(`api/users/${id}`, {method: 'PUT', headers: userFetchService.head, body: JSON.stringify(user)}),
    deleteUser: async (id) => await fetch(`api/users/${id}`, {method: 'DELETE', headers: userFetchService.head})
}

async function getTableWithUsers() {
    let table = $('#mainTableWithUsers1 tbody');
    table.empty();
    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let userRole = "";
                for (let i = 0; i < user.roles.length; i++) {
                    userRole += " " + user.roles[i].role;
                }
                let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.lastName}</td>
                            <td>${user.email}</td>
                            <td>${user.age}</td>    
                            <td>${userRole}</td>   
                            <td><button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info"
                                data-toggle="modal" data-target="#someDefaultModal">Edit</button>  
                            </td>
                            <td> <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger" 
                                data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })

    // обрабатываем нажатие на любую из кнопок edit или delete
    // достаем из нее данные и отдаем модалке, которую к тому же открываем
    $("#mainTableWithUsers1").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}
function getRole(roleSelect) {
    let data = [];
    $(roleSelect).find("option:selected").each(function () {
        data.push({id: $(this).val(), role: $(this).attr("name"), authority: $(this).attr("name")})
    });
    return data;
}

async function getNewUserForm() {
    let button = $(`#SliderNewUserForm`);
    let form = $(`#defaultSomeForm`)
    button.on('click', () => {
        if (form.attr("data-hidden") === "true") {
            form.attr('data-hidden', 'false');
            form.show();
            button.text('Hide panel');
        } else {
            form.attr('data-hidden', 'true');
            form.hide();
            button.text('Show panel');
        }
    })
}

// что то деалем при открытии модалки и при закрытии
// основываясь на ее дата атрибутах
async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}


// редактируем юзера из модалки редактирования, забираем данные, отправляем
async function editUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();
    modal.find('.modal-title').html('Edit user');
    let editButton = `<button  class="btn btn-info" id="editButton">Edit</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);
    user.then(user => {
        let bodyForm = `
            <form class="form-group" id="editUser">
                <div align="center">
                    <label for="id" class="col-form-label">ID</label>
                    <input type="number" class="form-control" id="id" name="id" value="${user.id}" disabled><br>   
                    <label for="name" class="col-form-label">First name</label> 
                    <input class="form-control" type="text" id="name"  value="${user.name}"><br>
                    <label for="lastname" class="col-form-label">Last name</label>
                    <input class="form-control" type="text" id="lastname" value="${user.lastName}"><br>
                    <label for="email" class="col-form-label">Email</label>
                    <input class="form-control" type="email" id="email" value="${user.email}"><br> 
                    <label for="password" class="col-form-label">Password</label>
                    <input class="form-control" type="password" id="password"><br>
                    <label for="age" class="col-form-label">Age</label>
                    <input class="form-control" id="age" type="number" value="${user.age}">
                    <label><b>Role</b>
                        <select multiple size="2" name="select_role2" class="form-control" id="selectRole2">
                            <option name="ROLE_ADMIN" value="1">ADMIN</option>
                            <option name="ROLE_USER" value="2" selected="selected">USER</option>
                        </select>
                    </label>
                </div>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })


    $("#editButton").on('click', async () => {
        let id = modal.find("#id").val().trim();
        let name = modal.find("#name").val().trim();
        let lastName = modal.find("#lastname").val().trim();
        let email = modal.find("#email").val().trim();
        let password = modal.find("#password").val().trim();
        let age = modal.find("#age").val().trim();
        let roles = getRole("#selectRole2");
        let data = {
            id: id,
            name: name,
            lastName: lastName,
            email: email,
            password: password,
            age: age,
            roles: roles
        }
        const response = await userFetchService.updateUser(data, id);

        if (response.ok) {
            await getTableWithUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}


// удаляем юзера из модалки удаления
async function deleteUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();
    modal.find('.modal-title').html('Delete User');
    let delButton = `<button  class="btn btn-danger" id="delButton">Delete</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    user.then(user => {
        let bodyForm = `
            <form class="form-group" id="delUser">
               <div align="center">
                <label for="id" class="col-form-label">ID</label>
                <input type="number" class="form-control " id="id" name="id" value="${user.id}" disabled><br>   
                <label for="name" class="col-form-label">First name</label> 
                <input class="form-control" type="text" id="name"  value="${user.name}" disabled><br>
                <label for="lastname" class="col-form-label">Last name</label>
                <input class="form-control" type="text" id="lastname" value="${user.lastName}" disabled><br>
                <label for="email" class="col-form-label">Email</label>
                <input class="form-control" type="email" id="email" value="${user.email}" disabled><br> 
                <label for="age" class="col-form-label">Age</label>
                <input class="form-control" id="age" type="number" value="${user.age}" disabled>
                </div>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })
    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(delButton);
    $("#delButton").on('click', async () => {
        await userFetchService.deleteUser(id);
        await getTableWithUsers();
        modal.modal('hide');
    })
}

async function addNewUser() {
    $('#addNewUserButton1').click(async () =>  {
        let addUserForm = $('#defaultSomeForm1')
        let name = addUserForm.find('#exampleInputName1').val().trim();
        let lastName = addUserForm.find('#exampleInputLast1').val().trim();
        let email = addUserForm.find('#exampleInputEmail1').val().trim();
        let password = addUserForm.find('#exampleInputPassword1').val().trim();
        let age = addUserForm.find('#exampleInputAge').val().trim();
        let roles = getRole("#selectRole");
        let data = {
            name: name,
            lastName: lastName,
            email:email,
            password: password,
            age: age,
            roles: roles
        }
        const response = await userFetchService.addNewUser(data);
        if (response.ok) {
            await getTableWithUsers();
            addUserForm.find('#exampleInputName1').val('');
            addUserForm.find('#exampleInputLast1').val('');
            addUserForm.find('#exampleInputEmail1').val('');
            addUserForm.find('#exampleInputPassword1').val('');
            addUserForm.find('#exampleInputAge').val('');
            addUserForm.find('#selectRole').val('');
            document.location.replace("/admin");
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addUserForm.prepend(alert)
        }
    })

}
