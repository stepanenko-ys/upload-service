from django.contrib import admin
from .models import Company, Folder


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    ordering = ('id', )
    list_display = ('id', 'name')
    list_display_links = ('id', 'name')


@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    search_fields = ('id', 'name', 'unique_folder_name', 'company')
    list_display = ('id', 'name', 'unique_folder_name', 'share', 'company')
    list_display_links = ('id', 'name')
    ordering = ('id', )
