from django.db import models
from django.contrib.auth.models import User, Group
from time import time
from django.utils import timezone
import datetime
from allauth.socialaccount.signals import social_account_added
from allauth.account.signals import user_signed_up
from django.dispatch import receiver
from django.contrib import admin
# from ecommerce.models import Address



def getSignaturesPath(instance , filename):
    return 'HR/images/Sign/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)
def getDisplayPicturePath(instance , filename):
    return 'HR/images/DP/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)
def getIDPhotoPath(instance , filename ):
    return 'HR/images/ID/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)
def getTNCandBondPath(instance , filename ):
    return 'HR/doc/TNCBond/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)
def getResumePath(instance , filename ):
    return 'HR/doc/Resume/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)
def getCertificatesPath(instance , filename ):
    return 'HR/doc/Cert/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)
def getTranscriptsPath(instance , filename ):
    return 'HR/doc/Transcripts/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)
def getOtherDocsPath(instance , filename ):
    return 'HR/doc/Others/%s_%s_%s' % (str(time()).replace('.', '_'), instance.user.username, filename)

class Document(models.Model):
    created = models.DateTimeField(auto_now_add = True)
    issuedBy = models.ForeignKey(User , related_name='certificatesIssued')
    description = models.CharField(max_length=400, blank=False)
    issuedTo = models.CharField(max_length=400, blank=False)
    passKey = models.CharField(max_length = 4, blank = False)
    email = models.CharField(max_length = 35, blank = False)
    docID = models.CharField(max_length = 10 , blank = True)
    app = models.CharField(max_length = 20 , blank = True)

    def __str__(self):
        return "%s : %s" %(self.issuedTo , self.description)

admin.site.register(Document)

KEY_CHOICES = (
    ('hashed', 'hashed'),
    ('otp', 'otp')
)

class accountsKey(models.Model):
    user = models.ForeignKey(User , related_name='accountKey')
    activation_key = models.CharField(max_length=40, blank=True)
    key_expires = models.DateTimeField(default=timezone.now)
    keyType = models.CharField(max_length = 6 , default = 'hashed' , choices = KEY_CHOICES)

class profile(models.Model):
    user = models.OneToOneField(User)
    displayPicture = models.ImageField(upload_to = getDisplayPicturePath)
    mobile = models.CharField(null = True , max_length = 14)

User.profile = property(lambda u : profile.objects.get_or_create(user = u)[0])
