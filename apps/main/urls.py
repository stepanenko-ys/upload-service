from django.urls import path
from . import views


urlpatterns = [
    path('', views.main, name='main_page'),
    path('ajax-upload-file', views.ajax_upload_file, name='ajax_upload_file'),
    path('ajax-create-folder', views.ajax_create_folder, name='ajax_create_folder'),
    path('ajax-create-sub-folder', views.ajax_create_sub_folder, name='ajax_create_sub_folder'),
    path('ajax-rename-folder', views.ajax_rename_folder, name='ajax_rename_folder'),
    path('ajax-delete-folder', views.ajax_delete_folder, name='ajax_delete_folder'),
    path('ajax-share-folder', views.ajax_share_folder, name='ajax_share_folder'),
    path('ajax-get-folder-content', views.ajax_get_folder_content, name='ajax_get_folder_content'),
]
