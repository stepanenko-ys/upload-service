// Navbar Container
let logoBlock = document.getElementById("logo-container");
let contactBlock = document.getElementById("btn-powered-by");

logoBlock.addEventListener("mouseover", function() {logoBlock.style.top = '0'}, false);
logoBlock.addEventListener("mouseout", function() {logoBlock.style.top = '-76px'}, false);
contactBlock.addEventListener("mouseover", function() {contactBlock.style.top = '0'}, false);
contactBlock.addEventListener("mouseout", function() {contactBlock.style.top = '-56px'}, false);
// / Navbar Container

let createFolderMode = false;
let createSubFolderMode = false;

function folderRow(key) {
     let tagDivMain = document.createElement("div");
     tagDivMain.setAttribute("class", "folder-row");
     tagDivMain.setAttribute("data-unique_folder_name", key['unique_file_name']);

     let tagDiv1 = document.createElement("div");
     tagDiv1.style.display = "flex";
     tagDiv1.style.position = "relative";

     // -- Share container --
     let tagDiv3 = document.createElement("div");
     tagDiv3.setAttribute("class", "share-icon-block");
     tagDiv3.setAttribute("onmouseover", "overShareIconBlock(this)");
     tagDiv3.setAttribute("onmouseout", "outShareIconBlock(this)");

     if (key['share'] === true) {
          let tagImg1 = document.createElement("img");
          tagImg1.src = "https://www.svgrepo.com/show/1328/cloud.svg";
          tagImg1.setAttribute("class", "share-icon");
          tagImg1.setAttribute("onclick", "enableShareFolder(this)");
          tagDiv3.appendChild(tagImg1);
     } else {
          let tagImg2 = document.createElement("img");
          tagImg2.src = "https://www.svgrepo.com/show/90409/cloud.svg";
          tagImg2.setAttribute("class", "share-icon");
          tagImg2.setAttribute("onclick", "disabledShareFolder(this)");
          tagDiv3.appendChild(tagImg2);
     }

     let tagDiv4 = document.createElement("div");
     // tagDiv4.setAttribute("class", "unique_folder_name");
     tagDiv4.setAttribute("class", "unique_folder_name hide");

     const textUniqueFolderName = document.createTextNode(key['unique_file_name']);
     tagDiv4.appendChild(textUniqueFolderName);

     tagDiv3.appendChild(tagDiv4);
     // -/ Share container --

     //  {% endif %}


     // -- Rename Folder --
     let tagDiv5 = document.createElement("div");
     tagDiv5.setAttribute("class", "block_input-folder-name hide");

     let tagDiv6 = document.createElement("div");
     tagDiv6.style.display = "flex";

     let newInputFolderName = document.createElement("input");
     newInputFolderName.setAttribute("type", "text");
     newInputFolderName.setAttribute("class", "input_folder-name");
     newInputFolderName.setAttribute("value", key['file_name_origin']);

     let tagImg3 = document.createElement("img");
     tagImg3.src = "https://www.svgrepo.com/show/362151/sign-check.svg";
     tagImg3.style.marginLeft = "5px";
     tagImg3.style.height = "25px";
     tagImg3.setAttribute("onclick", "renameFolder(this)");

     tagDiv6.appendChild(newInputFolderName);
     tagDiv6.appendChild(tagImg3);

     tagDiv5.appendChild(tagDiv6);
     // -/ Rename Folder --


     let tagImg4 = document.createElement("img");
     tagImg4.src = "https://www.svgrepo.com/show/19947/folders.svg";
     tagImg4.setAttribute("class", "folder-icon");
     tagImg4.setAttribute("onclick", "showFileInFolder(this)");

     let tagSpan = document.createElement("span");
     tagSpan.setAttribute("onclick", "showFileInFolder(this)");
     const textFolderName = document.createTextNode(key['file_name_origin']);
     tagSpan.appendChild(textFolderName);

     // tagDiv3.appendChild(tagSpan);


     // <div className="hide" data-is-open="false"></div>

     tagDiv1.appendChild(tagDiv3);
     tagDiv1.appendChild(tagDiv5);
     tagDiv1.appendChild(tagImg4);
     tagDiv1.appendChild(tagSpan);

     // const textFordelName = document.createTextNode(key['file_name_origin']);  // {{folder.forder_name}}
     // tagDiv1.appendChild(textFordelName);

     let tagDiv2 = document.createElement("div");

     let tagImg5 = document.createElement("img");
     tagImg5.src = "https://www.svgrepo.com/show/60515/edit.svg";
     tagImg5.setAttribute("class", "edit-icon");
     tagImg5.setAttribute("onclick", "enableRenameFolder(this)");

     let tagImg6 = document.createElement("img");
     tagImg6.src = "https://www.svgrepo.com/show/45964/delete.svg";
     tagImg6.setAttribute("class", "edit-icon");
     tagImg6.setAttribute("onclick", "deleteFolder(this)");

     tagDiv2.appendChild(tagImg5);
     tagDiv2.appendChild(tagImg6);

     tagDivMain.appendChild(tagDiv1);
     tagDivMain.appendChild(tagDiv2);

     return tagDivMain;
}

function showFileInFolder(obj){
     let isOpened = obj.parentElement.parentElement.nextElementSibling.getAttribute('data-is-open')

     if (isOpened !== 'false') {
          obj.parentElement.parentElement.nextElementSibling.innerHTML = '';
          obj.parentElement.parentElement.nextElementSibling.classList.add('hide')
          obj.parentElement.parentElement.nextElementSibling.setAttribute('data-is-open', 'false')
          createFolderMode = false;
          createSubFolderMode = false;
     } else {
          obj.parentElement.parentElement.nextElementSibling.classList.remove('hide')
          obj.parentElement.parentElement.nextElementSibling.setAttribute('data-is-open', 'true')

          // -- Create button Add New SubFolder --
          let tagDiv = document.createElement("div");
          tagDiv.setAttribute("class", "btn-add-new-sub-folder");
          tagDiv.setAttribute("onClick", "addNewSubFolder(this)");

          let tagImg = document.createElement("img");
          tagImg.src = "https://www.svgrepo.com/show/274149/folder-add.svg";
          tagImg.setAttribute("class", "new-folder-icon-2");

          const textAddSubFolder = document.createTextNode("Add subfolder");

          tagDiv.appendChild(tagImg);
          tagDiv.appendChild(textAddSubFolder);
          obj.parentElement.parentElement.nextElementSibling.appendChild(tagDiv);
          // -- / Create button Add New SubFolder --

          const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
          let uniqueFolderName = obj.parentElement.parentElement.getAttribute('data-unique_folder_name');
          let data = new FormData();
          data.append('unique_folder_name', uniqueFolderName);

          $.ajax({
               url: "/ajax-get-folder-content",
               method: 'POST',
               headers: {'X-CSRFToken': csrfToken},
               data: data,
               contentType: false,
               processData: false,
               success: function (data) {

                    let folderContent = obj.parentElement.parentElement.nextElementSibling;
                    $.each(data['files'], function (item, key) {

                         if (key['is_file'] === true) {
                              let tagDiv = document.createElement("div");
                              tagDiv.style.paddingLeft = "40px";
                              tagDiv.style.display = "flex";

                              let tagImg = document.createElement("img");
                              tagImg.src = "https://www.svgrepo.com/show/236/file.svg";
                              tagImg.setAttribute("class", "folder-icon");

                              let tagA = document.createElement("a");
                              let title = document.createTextNode(key['file_name']);
                              tagA.appendChild(title);
                              tagA.href = key['file_url'];
                              tagA.target = "_blank";

                              tagDiv.appendChild(tagImg);
                              tagDiv.appendChild(tagA);
                              folderContent.appendChild(tagDiv);
                         }



                         // if (key['is_file'] === true) {} else {
                         //      tagImg.src = "https://www.svgrepo.com/show/19947/folders.svg";
                         // }

                         if (key['is_file'] !== true) {
                              obj.parentElement.parentElement.nextElementSibling.appendChild(folderRow(key));

                              let tagDiv2 = document.createElement("div");
                              tagDiv2.setAttribute("class", "hide");
                              tagDiv2.setAttribute("data-is-open", "false");
                              tagDiv2.style.paddingLeft = '30px';
                              obj.parentElement.parentElement.nextElementSibling.appendChild(tagDiv2);

                              // let tagDivFolder = document.createElement("div");
                              // folderContent.appendChild(tagDivFolder);
                         }

                         // tagDiv.appendChild(tagImg);
                         // if (key['is_file'] === true) {} else {
                         //      tagDiv.appendChild(tagDivFolder);
                         // }
                         // console.log(777, folderContent);
                         // console.log(888, tagDiv);
                         // folderContent.appendChild(tagDiv);
                         // console.log(999, folderContent);

                    });
               },
               error: function (data) {console.log("AJAX - ERROR", data)}
          });
     }
}

function addNewFolder(){
     if (createFolderMode === false) {
          let newImgShareTag = document.createElement("img");
          newImgShareTag.src = "https://www.svgrepo.com/show/90409/cloud.svg";
          newImgShareTag.setAttribute("class", "new-share-icon");

          let newImgFolderTag = document.createElement("img");
          newImgFolderTag.src = "https://www.svgrepo.com/show/19947/folders.svg";
          newImgFolderTag.setAttribute("class", "new-folder-icon-1");

          let newImgCreateTag = document.createElement("img");
          newImgCreateTag.src = "https://www.svgrepo.com/show/362151/sign-check.svg";
          newImgCreateTag.setAttribute("onclick", "createFolder(this)");
          newImgCreateTag.setAttribute("class", "new-create-icon");

          let newInputTag = document.createElement("input");
          newInputTag.setAttribute("type", "text");
          newInputTag.setAttribute("placeholder", "New folder name");
          newInputTag.setAttribute("class", "new-input-tag");

          let folderRows = document.getElementById("folder-rows");
          folderRows.appendChild(newImgShareTag);
          folderRows.appendChild(newImgFolderTag);
          folderRows.appendChild(newInputTag);
          folderRows.appendChild(newImgCreateTag);
     }
     createFolderMode = true;
}

function addNewSubFolder(obj){
     if (createSubFolderMode === false) {
          let newImgShareTag = document.createElement("img");
          newImgShareTag.src = "https://www.svgrepo.com/show/90409/cloud.svg";
          newImgShareTag.setAttribute("class", "new-share-icon");
          newImgShareTag.style.marginLeft = "40px";

          let newImgFolderTag = document.createElement("img");
          newImgFolderTag.src = "https://www.svgrepo.com/show/19947/folders.svg";
          newImgFolderTag.setAttribute("class", "new-folder-icon-1");

          let newImgCreateTag = document.createElement("img");
          newImgCreateTag.src = "https://www.svgrepo.com/show/362151/sign-check.svg";
          newImgCreateTag.setAttribute("onclick", "createSubFolder(this)");
          newImgCreateTag.setAttribute("class", "new-create-icon");

          let newInputTag = document.createElement("input");
          newInputTag.setAttribute("type", "text");
          newInputTag.setAttribute("placeholder", "New folder name");
          newInputTag.setAttribute("class", "new-input-tag");

          let folderRows = obj.parentElement;
          folderRows.appendChild(newImgShareTag);
          folderRows.appendChild(newImgFolderTag);
          folderRows.appendChild(newInputTag);
          folderRows.appendChild(newImgCreateTag);
     }
     createSubFolderMode = true;
}

function createFolder(obj){
     const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
     const newFolderName = obj.previousElementSibling.value

     if (newFolderName != "") {
          let data = new FormData();
          data.append('new_folder_name', newFolderName)

          $.ajax({
               url: "/ajax-create-folder",
               method: 'POST',
               headers: {'X-CSRFToken': csrfToken},
               data: data,
               contentType: false,
               processData: false,
               success: function (data) {},
               error: function (data) {console.log("AJAX - ERROR", data)}
          });
          createFolderMode = false;
     }
     setTimeout(function(){
          window.location.reload();
     }, 300);
}

function createSubFolder(obj){
     const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
     const newFolderName = obj.previousElementSibling.value
     const parentFolder = obj.parentElement.previousElementSibling.getAttribute('data-unique_folder_name');

     if (newFolderName != "") {
          let data = new FormData();
          data.append('new_folder_name', newFolderName)
          data.append('parent_folder', parentFolder)

          $.ajax({
               url: "/ajax-create-sub-folder",
               method: 'POST',
               headers: {'X-CSRFToken': csrfToken},
               data: data,
               contentType: false,
               processData: false,
               success: function (data) {},
               error: function (data) {console.log("AJAX - ERROR", data)}
          });
          createSubFolderMode = false;
     }
     setTimeout(function(){
          window.location.reload();
     }, 300);
}

function enableRenameFolder(obj){
     let blockInputFolderName = obj.parentElement.previousElementSibling.firstElementChild.nextElementSibling;
     blockInputFolderName.classList.toggle('hide');
}

function renameFolder(obj){
     const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
     let uniqueFolderName = obj.parentElement.parentElement.parentElement.parentElement.getAttribute('data-unique_folder_name');
     let newFolderName = obj.previousElementSibling.value;
     obj.parentElement.parentElement.classList.toggle('hide');

     let data = new FormData();
     data.append('unique_folder_name', uniqueFolderName);
     data.append('new_folder_name', newFolderName);

     $.ajax({
          url: "/ajax-rename-folder",
          method: 'POST',
          headers: {'X-CSRFToken': csrfToken},
          data: data,
          contentType: false,
          processData: false,
          success: function (data) {},
          error: function (data) {console.log("AJAX - ERROR", data)}
     });
     setTimeout(function(){
          window.location.reload();
     }, 300);
}

function deleteFolder(obj){
     const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
     let uniqueFolderName = obj.parentElement.parentElement.getAttribute('data-unique_folder_name');
     let data = new FormData();
     data.append('unique_folder_name', uniqueFolderName);

     $.ajax({
          url: "/ajax-delete-folder",
          method: 'POST',
          headers: {'X-CSRFToken': csrfToken},
          data: data,
          contentType: false,
          processData: false,
          success: function (data) {},
          error: function (data) {console.log("AJAX - ERROR", data)}
     });
     setTimeout(function(){
          window.location.reload();
     }, 300);
}

function enableShareFolder(obj){
     const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
     let uniqueFolderName = obj.parentElement.parentElement.parentElement.getAttribute('data-unique_folder_name');
     let data = new FormData();
     data.append('unique_folder_name', uniqueFolderName);
     data.append('folder_share', 'false');

     $.ajax({
          url: "/ajax-share-folder",
          method: 'POST',
          headers: {'X-CSRFToken': csrfToken},
          data: data,
          contentType: false,
          processData: false,
          success: function (data) {},
          error: function (data) {console.log("AJAX - ERROR", data)}
     });
     setTimeout(function(){
          window.location.reload();
     }, 300);
}

function disabledShareFolder(obj){
     const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
     let uniqueFolderName = obj.parentElement.parentElement.getAttribute('data-unique_folder_name');
     if (uniqueFolderName === null) {
          uniqueFolderName = obj.parentElement.parentElement.parentElement.getAttribute('data-unique_folder_name');
     }
     let data = new FormData();
     data.append('unique_folder_name', uniqueFolderName);
     data.append('folder_share', 'true');

     $.ajax({
          url: "/ajax-share-folder",
          method: 'POST',
          headers: {'X-CSRFToken': csrfToken},
          data: data,
          contentType: false,
          processData: false,
          success: function (data) {},
          error: function (data) {console.log("AJAX - ERROR", data)}
     });
     setTimeout(function(){
          window.location.reload();
     }, 300);
}

function overShareIconBlock(obj) {obj.lastElementChild.classList.remove('hide')}
function outShareIconBlock(obj) {obj.lastElementChild.classList.add('hide')}