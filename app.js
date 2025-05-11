const cl = console.log;

const postContainer = document.getElementById('postContainer');
const loader = document.getElementById('loader');
const postForm = document.getElementById('postForm');
const titleControl = document.getElementById('title');
const contentControl = document.getElementById('content');
const userIdControl = document.getElementById('userId');
const addPostBtn = document.getElementById('addPostBtn');
const updatePostBtn = document.getElementById('updatePostBtn'); 

const basrURL = `https://jsonplaceholder.typicode.com`;
const postURL = `${basrURL}/posts`;

const snackBar = (msg, icon) => {
    swal.fire({
        title : msg,
        icon : icon,
        timer : 3000
    })
}

const onScroll = () => {
    window.scroll({
        top : 0,
        behavior : 'smooth'
    })
}

const createCards = (arr) => {
    let result = '';
    arr.forEach(post => {
        result += `  <div class="col-md-4 mb-3" id='${post.id}'>
                <div class="card h-100">
                    <div class="card-header bg-info">
                        <h3>${post.title}</h3>
                    </div>
                    <div class="card-body bg-warning">
                        <p>${post.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-sm btn-outline-info" onclick='onEditPost(this)'>Edit</button>
                        <button class="btn btn-sm btn-outline-danger" onclick='onRemovePost(this)'>Remove</button>

                    </div>
                </div>
            </div>`
    });
    postContainer.innerHTML = result;

}

const onEditPost = (ele) => {
    onScroll();
    let editId = ele.closest('.col-md-4').id;
    localStorage.setItem('editId', editId);

    let editURL = `${basrURL}/posts/${editId}`;

     loader.classList.remove('d-none');
    let xhr = new XMLHttpRequest();
    xhr.open('GET', editURL);
    xhr.send(null);

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300){
            let data = JSON.parse(xhr.response);
            cl(data);
            
            titleControl.value = data.title;
            contentControl.value = data.body;
            userIdControl.value = data.userId;

            addPostBtn.classList.add('d-none');
            updatePostBtn.classList.remove('d-none');
        }else{
            snackBar('something went wrong', 'error')
        }
        loader.classList.add('d-none');
    }
}

const onRemovePost = (ele) => {
    let getConfirm = confirm('Are you sure, you want to remove this Post');

    if(getConfirm){
        let removeId = ele.closest('.col-md-4').id;
        let removeURL = `${basrURL}/posts/${removeId}`;

         loader.classList.remove('d-none');
        let xhr = new XMLHttpRequest();
        xhr.open('GET', postURL);
        xhr.send(null);

        xhr.onload = function(){
            if(xhr.status >= 200 && xhr.status < 300){
                let data = JSON.parse(xhr.response);
                cl(data);
                
                document.getElementById(removeId).remove();

                snackBar(`Post with id ${removeId} removed succesfully!!`, 'success');
            }else{
                snackBar('something went wrong', 'error')
        }
            loader.classList.add('d-none');
    }
    }
}

const fetchPost = () => {
    loader.classList.remove('d-none');
    let xhr = new XMLHttpRequest();
    xhr.open('GET', postURL);
    xhr.send(null);

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300){
            let data = JSON.parse(xhr.response);
            cl(data);
            createCards(data);
        }else{
            snackBar('something went wrong', 'error')
        }
        loader.classList.add('d-none');
    }
}
fetchPost();

const onAddPost = (eve) => {
    eve.preventDefault();
    let postObj = {
        title : titleControl.value,
        body : contentControl.value,
        userId : userIdControl.value
    }
    eve.target.reset();

      loader.classList.remove('d-none');
    let xhr = new XMLHttpRequest();
    xhr.open('GET', postURL);
    xhr.send(JSON.stringify(postObj));

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300){
            let data = JSON.parse(xhr.response);
            cl(data);

            let colDiv = document.createElement('div');
            colDiv.className = 'col-md-4 mb-3';
            colDiv.id = data.id;
            colDiv.innerHTML = `<div class="card h-100">
                    <div class="card-header bg-info">
                        <h3>${postObj.title}</h3>
                    </div>
                    <div class="card-body bg-warning">
                        <p>${postObj.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-sm btn-outline-info" onclick='onEditPost(this)'>Edit</button>
                        <button class="btn btn-sm btn-outline-danger" onclick='onRemovePost(this)'>Remove</button>

                    </div>
                </div>`
            postContainer.prepend(colDiv);

            snackBar(`New Post created successfully!!`, 'success');
        }else{
            snackBar('something went wrong', 'error')
        }
        loader.classList.add('d-none');
    }
}

const onUpdatePost = () => {
    let updateId = localStorage.getItem('editId');
    let updateObj = {
        title : titleControl.value,
        body : contentControl.value,
        userId : userIdControl.value
    }
    cl(updateObj)
    postForm.reset();

    let updateURL = `${basrURL}/posts/${updateId}`;

    loader.classList.remove('d-none');
    let xhr = new XMLHttpRequest();
    xhr.open('PATCH', updateURL);
    xhr.send(JSON.stringify(updateObj));

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300){
            let data = JSON.parse(xhr.response);
            cl(data);
           
            addPostBtn.classList.remove('d-none');
            updatePostBtn.classList.add('d-none');

            let div = document.getElementById(updateId);
            div.querySelector('h3').innerHTML = updateObj.title;
            div.querySelector('p').innerHTML = updateObj.body;

            snackBar(`Post with id ${updateId} is updated successfully!!`, 'success');

            let updatePost = document.getElementById(updateId);
            updatePost.scrollIntoView({
                behavior : 'smooth'
            })
           
        }else{
            snackBar('something went wrong', 'error')
        }
        loader.classList.add('d-none');
    }    
}
postForm.addEventListener('submit', onAddPost);
updatePostBtn.addEventListener('click', onUpdatePost);