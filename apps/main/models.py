import os
import shutil

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save, post_delete


class Company(models.Model):
    owner = models.ForeignKey(User, verbose_name="User", on_delete=models.CASCADE, default=None, null=True, blank=True)
    name = models.CharField(max_length=128, blank=True, null=True, default=None)
    created = models.DateTimeField(auto_now_add=True, auto_now=False, null=True, blank=True)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True, null=True, blank=True)


def create_folder(**kwargs):
    instance = kwargs.get('instance')
    print(instance.id)
    os.mkdir(f"media/company_{instance.id}")


def delete_folder(**kwargs):
    instance = kwargs.get('instance')
    print(instance.id)
    full_patch_folder = f"media/company_{instance.id}"
    if os.path.isdir(full_patch_folder):
        shutil.rmtree(full_patch_folder)


post_save.connect(create_folder, sender=Company)
post_delete.connect(delete_folder, sender=Company)


class Folder(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=128, blank=True, null=True, default=None)
    unique_folder_name = models.CharField(max_length=128, blank=True, null=True, default=None)
    full_path = models.CharField(max_length=256, blank=True, null=True, default=None)
    parent_folder = models.IntegerField(verbose_name="Parent Folder", blank=True, null=True, default=0)
    company = models.ForeignKey(Company, verbose_name="Company", on_delete=models.CASCADE, default=None)
    share = models.BooleanField(verbose_name="Share folder", null=True, default=False)
    created = models.DateTimeField(auto_now_add=True, auto_now=False, null=True, blank=True)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True, null=True, blank=True)

    def __str__(self):
        return "(id.%s) - %s - %s - %s - %s" % (self.id, self.name, self.unique_folder_name,  self.share, self.company)
