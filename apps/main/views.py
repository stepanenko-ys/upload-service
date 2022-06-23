import os
import shutil
import glob

from django.contrib.auth.decorators import login_required
from django.core.files.storage import FileSystemStorage
from django.shortcuts import render
from django.http import JsonResponse
from apps.main.models import Company, Folder
from django.contrib.auth.models import User

from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def ajax_upload_file(request):
    response = None

    if request.method == "POST" and request.__getattribute__('FILES'):

        folder = Folder.objects.filter(unique_folder_name=request.POST.get("folder_url_address")).first()
        if folder and folder.share:
            full_folder_patch = f"{folder.full_path}"
            file = request.FILES.getlist('file')[0]

            # Save upload file
            fs = FileSystemStorage(location=full_folder_patch,
                                   base_url=full_folder_patch)
            fs.save(file.name, file)
            # End - Save upload file

            response = JsonResponse({"status_code": "200"})
        else:
            response = JsonResponse({"status_code": "400"})

    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response["Access-Control-Max-Age"] = "1000"
    response["Access-Control-Allow-Headers"] = "X-Requested-With, Content-Type"
    return response


def ajax_create_folder(request):
    last_folder = Folder.objects.last()
    new_folder_id = last_folder.id + 1 if last_folder else 1
    new_folder_name = request.POST.get("new_folder_name")
    company = Company.objects.get(owner=request.user)
    unique_folder_name = f"{new_folder_name.lower().replace(' ', '-')}_{new_folder_id}_{company.id}_{request.user.id}"
    full_path = f"media/company_{company.id}/{new_folder_name.lower().replace(' ', '-')}_{new_folder_id}"

    Folder.objects.create(
        id=new_folder_id,
        name=new_folder_name,
        company=company,
        unique_folder_name=unique_folder_name,
        full_path=full_path
    )
    os.mkdir(full_path)

    return JsonResponse({"status": "Ok"})


def ajax_create_sub_folder(request):
    last_folder = Folder.objects.last()
    new_folder_id = last_folder.id + 1 if last_folder else 1
    new_folder_name = request.POST.get("new_folder_name")

    parent_folder = request.POST.get("parent_folder")
    parent_folder_obj = Folder.objects.filter(unique_folder_name=parent_folder).first()

    full_path = f"{parent_folder_obj.full_path}/{new_folder_name.lower().replace(' ', '-')}_{new_folder_id}"
    company = Company.objects.get(owner=request.user)
    unique_folder_name = f"{new_folder_name.lower().replace(' ', '-')}_{new_folder_id}_{company.id}_{request.user.id}"

    Folder.objects.create(
        id=new_folder_id,
        name=new_folder_name,
        full_path=full_path,
        parent_folder=parent_folder_obj.id,
        company=company,
        unique_folder_name=unique_folder_name
    )
    os.mkdir(full_path)

    return JsonResponse({"status": "Ok"})


def ajax_rename_folder(request):

    folder = Folder.objects.get(unique_folder_name=request.POST.get("unique_folder_name"))
    old_folder_name = folder.name
    new_folder_name = request.POST.get("new_folder_name")
    old_patch_folder_name = folder.full_path
    new_patch_folder_name = folder.full_path.replace(f"{old_folder_name.lower().replace(' ', '-')}_{folder.id}", f"{new_folder_name.lower().replace(' ', '-')}_{folder.id}")

    folder.name = new_folder_name
    folder.unique_folder_name = f"{new_folder_name.lower().replace(' ', '-')}_{folder.id}_{folder.company.id}_{folder.company.owner.id}"
    folder.full_path = new_patch_folder_name
    folder.save()

    os.rename(old_patch_folder_name, new_patch_folder_name)

    return JsonResponse({"status": "Ok"})


def ajax_delete_folder(request):

    folder = Folder.objects.get(unique_folder_name=request.POST.get("unique_folder_name"))

    company = Company.objects.get(owner=request.user)
    full_patch_folder = f"media/company_{company.id}/{folder.name.lower().replace(' ', '-')}_{folder.id}"
    if os.path.isdir(full_patch_folder):
        shutil.rmtree(full_patch_folder)

    folder.delete()

    return JsonResponse({"status": "Ok"})


def ajax_share_folder(request):

    new_status = True if request.POST.get("folder_share") == 'true' else False

    folder = Folder.objects.get(unique_folder_name=request.POST.get("unique_folder_name"))
    folder.share = new_status
    folder.save()

    status = {"status": "Ok"}
    return JsonResponse(status)


def ajax_get_folder_content(request):
    res = {"files": []}
    folder = Folder.objects.get(unique_folder_name=request.POST.get("unique_folder_name"))
    for file in glob.glob(f"{folder.full_path}/*"):
        if os.path.isdir(file):
            current_folder = Folder.objects.filter(full_path=file).first()
            if not current_folder:
                continue
            res["files"].insert(0, {
                "is_file": False,
                "file_name": file.split('/')[-1].split('_')[0],
                "file_name_origin": current_folder.name,
                "unique_file_name": current_folder.unique_folder_name,
                "file_url": file,
                "share": current_folder.share
            })
        elif os.path.isfile(file):
            res["files"].append({
                "is_file": True,
                "file_name": file.split('/')[-1],
                "file_url": file,
                "share": ""
            })
    return JsonResponse(res)


@login_required
def main(request):
    if request.user.is_authenticated:
        user = User.objects.get(id=request.user.id)
        company = Company.objects.filter(owner=user.id).first()
        if company:
            folders = Folder.objects.filter(company=company, parent_folder=0)
            folder_tree = []
            # folder_tree_step = 0

            for folder in folders:
                folder_tree.append({
                    "forder_name": folder.name,
                    "unique_folder_name": folder.unique_folder_name,
                    "share": folder.share,
                    "files": []
                })

    project_description = 'This project is made for UpWork job dated May 19, 2022 with the title:<br>' \
                          'Create folder, subfolder there and get access to this subfolder by its<br>' \
                          'link from subdomain'

    return render(request, 'main/main.html', locals())
