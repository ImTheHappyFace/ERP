from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
from PIM.serializers import *
from HR.serializers import userSearchSerializer
from ERP.serializers import serviceLiteSerializer , serviceSerializer , addressSerializer
from rest_framework.response import Response
from fabric.api import *
import os
from django.conf import settings as globalSettings
# from clientRelationships.models import ProductMeta
# from clientRelationships.serializers import ProductMetaSerializer
from ERP.models import service , appSettingsField

import json
from bs4 import BeautifulSoup
import textwrap
from ecommerce.models import *


#------------------------- Printer Code ------------

# from __future__ import print_function
from os import environ
from django.forms.models import model_to_dict
import os
import argparse
# from twisted.internet import reactor
# from twisted.internet.defer import inlineCallbacks
#
# from autobahn.twisted.wamp import ApplicationSession, ApplicationRunner
import requests
from django.db.models import Sum

# from escpos import printer
# Epson = printer.Usb(0x154f,0x154f,0,0x81,0x02)
# Print text
from datetime import datetime
date_obj = datetime.now()
date = date_obj.strftime('%d/%m/%Y')
time_sec = date_obj.strftime('%H:%M:%S')












class StoreSerializer(serializers.ModelSerializer):
    owner = userSearchSerializer(many = False , read_only = True)
    moderators = userSearchSerializer(many = True , read_only = True)
    class Meta:
        model = Store
        fields = ('pk' ,'created','company' , 'name' , 'address' , 'pincode' , 'mobile' , 'email', 'gstin', 'gstincert', 'cin', 'personelid', 'owner','logo','copyrightHolder','fbLink','twitterLink','linkedinLink','playstoreLink','appstoreLink','pinterestLink','city','state','country','pos','cod','rating','filter','categoryBrowser','searchfieldplaceholder','codLimit','bankaccountNumber','ifsc','bankName','bankType','moderators','themeColor','payPal','paytm','payU','ccAvenue','googlePay','cartImage','paymentImage','paymentPotraitImage','searchBackgroundImg','blogBackgroundImg')
        read_only_fields = ( 'moderators' ,)
    def create(self , validated_data):
        s = Store(**validated_data)
        if 'owner' in self.context['request'].data:
            s.owner = User.objects.get(pk=self.context['request'].data['owner'])
        s.save()
        if 'moderators' in self.context['request'].data:
            # objData = self.request['request'].data['moderators']
            objData = str(self.context['request'].data['moderators']).split(',')
            for value in objData:
                s.moderators.add(User.objects.get(pk=value))
        s.save()
        return s

    def update(self ,instance, validated_data):
        for key in ['name' , 'company','address' , 'pincode' , 'mobile' , 'email', 'gstin', 'gstincert', 'cin', 'personelid','logo','copyrightHolder','fbLink','twitterLink','linkedinLink','playstoreLink','appstoreLink','pinterestLink','city','state','country','pos','cod','rating','filter','categoryBrowser','searchfieldplaceholder','codLimit','bankaccountNumber','ifsc','bankName','bankType','themeColor','payPal','paytm','payU','ccAvenue','googlePay','cartImage','paymentImage','paymentPotraitImage','searchBackgroundImg','blogBackgroundImg']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'owner' in self.context['request'].data:
            instance.owner = User.objects.get(pk=self.context['request'].data['owner'])
        instance.save()
        if 'moderators' in self.context['request'].data:
            instance.moderators.clear()
            # objData = str(self.context['request'].data['moderators'])
            objData = str(self.context['request'].data['moderators']).split(',')
            for value in objData:
                instance.moderators.add(User.objects.get(pk=value))
        instance.save()
        return instance


class MediaV2Serializer(serializers.ModelSerializer):
    class Meta:
        model = MediaV2
        fields = ('pk'  , 'created'  , 'link', 'attachment' , 'mediaType' , 'imageIndex')
    def create(self ,  validated_data):
        u = self.context['request'].user
        m = MediaV2(**validated_data)
        m.user = u
        m.save()
        return m
    def update(self , instance , validated_data):
        u = self.context['request'].user
        for key in ['link' , 'attachment' , 'mediaType','imageIndex']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        instance.user = u
        instance.save()
        return instance


class ProductMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductMeta
        fields = ('pk' , 'code' , 'typ'  , 'taxRate', 'description')

class CategoryV2Serializer(serializers.ModelSerializer):
    class Meta:
        model = GenericProductV2
        fields = ('pk' , 'name' , 'alias'  , 'created', 'minCost' , 'visual' , 'bannerImage' , 'parent' , 'restricted' , 'mobileBanner','store','categoryIndex')

# class ProductVariantV2liteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ProductVariantV2
#         fields = ('pk'  , 'sku'  , 'unitType' , 'price' , 'sellingPrice' , 'barcodeId' , 'shippingCost' , 'stock' , 'parent' , 'discount')


class ProductV2LiteSerializer(serializers.ModelSerializer):
    category = CategoryV2Serializer(many = False , read_only = True)
    variant = serializers.SerializerMethodField()
    class Meta:
        model = ProductV2
        fields = ('pk'  , 'category'  , 'name' , 'description' , 'variant')
    def get_variant(self , obj):
        try:
            Obj = list(ProductVariantV2.objects.filter(parent = obj).values())
            return Obj
        except:
            return []


class DiscountMatrixV2Serializer(serializers.ModelSerializer):
    class Meta:
        model = DiscountMatrixV2
        fields = ('pk' , 'product' , 'qty'  , 'discount')

class ProductV2Serializer(serializers.ModelSerializer):
    category = CategoryV2Serializer(many = False , read_only = True)
    class Meta:
        model = ProductV2
        fields = ('pk' , 'category'  , 'created', 'name' , 'description' , 'detailedDescription' , 'productIndex' , 'parentCode' , 'store')
    def create(self, validated_data):
        p = ProductV2(**validated_data)
        p.creator =  self.context['request'].user
        print self.context['request'].data['category'],"yahoooooooooooooooooooooooo"
        category =  self.context['request'].data['category']
        p.category =  GenericProductV2.objects.get(pk = category)
        p.save()
        return p

    def update(self,instance, validated_data):
        for key in ['created', 'name' , 'description' , 'detailedDescription' , 'productIndex' , 'parentCode' , 'store']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        category =  self.context['request'].data['category']
        instance.category =  GenericProductV2.objects.get(pk = category)
        print self.context['request'].user.pk,"kkkkkkkklllllllllllllllll"
        instance.save()
        return instance

class ProductVariantV2Serializer(serializers.ModelSerializer):
    productMeta = ProductMetaSerializer(many = False , read_only = True)
    images = MediaV2Serializer(many = True , read_only = True)
    class Meta:
        model = ProductVariantV2
        fields = ('pk' , 'created' , 'sku'  , 'unitType' , 'price' , 'sellingPrice' , 'specialOffer' , 'maxQtyOrder' , 'minQtyOrder' , 'reOrderThreshold' , 'barcodeId' , 'shippingCost' , 'stock' , 'displayName' , 'parent' , 'discount' , 'brand' , 'productMeta' , 'customizable' , 'deliveryTime' , 'customisedDeliveryTime' , 'images','value')

    def create(self, validated_data):
        p = ProductVariantV2(**validated_data)
        print self.context['request'].data
        p.save()
        if 'images' in self.context['request'].data:
            for image in self.context['request'].data['images']:
                print image,"llllllllllllllllkkkkkkkkkkkkkkkkkkkk$$$$$$$$$$$$$$4"
                p.images.add(MediaV2.objects.get(pk=image))
            p.save()
        if 'productMeta' in self.context['request'].data:
            pMeta =  self.context['request'].data['productMeta']
            p.productMeta =  ProductMeta.objects.get(pk = pMeta)
            p.save()
        parent = self.context['request'].data['parent']
        dpnameobj = ProductV2.objects.get(pk = parent)
        unitType = self.context['request'].data['unitType']
        value = self.context['request'].data['value']
        p.displayName = dpnameobj.name + " " + unitType + " " + str(value)
        p.save()
        return p

    def update(self,instance, validated_data):

        for key in [ 'sku'  , 'unitType' , 'price' , 'sellingPrice' , 'specialOffer' , 'maxQtyOrder' , 'minQtyOrder' , 'reOrderThreshold' , 'barcodeId' , 'shippingCost' , 'stock' , 'displayName' , 'parent' , 'discount' , 'brand' , 'productMeta' , 'customizable' , 'deliveryTime' , 'customisedDeliveryTime' , 'images','value' , 'gstType']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'images' in self.context['request'].data:
            for image in self.context['request'].data['images']:
                instance.images.add(MediaV2.objects.get(pk=image))
        if 'productMeta' in self.context['request'].data:
            prodmeta = self.context['request'].data['productMeta']
            instance.productMeta =  ProductMeta.objects.get(pk = prodmeta)
        if 'parent' in self.context['request'].data:
            parent = self.context['request'].data['parent']
            dpnameobj = ProductV2.objects.get(pk = parent)
            unitType = self.context['request'].data['unitType']
            value = self.context['request'].data['value']
            instance.displayName = dpnameobj.name + " " + unitType + " " + value
        instance.save()
        return instance

class TargetSerializer(serializers.ModelSerializer):
    product = ProductV2Serializer(many = True , read_only = True)
    class Meta:
        model = Target
        fields = ('pk' , 'created','updated','targetAmount' ,'achievedCoin' ,'status' ,'product','validity' )

    def create(self, validated_data):
        target = Target(**validated_data)
        target.save()
        if 'product' in self.context['request'].data:
            for t in self.context['request'].data['product']:
                target.product.add(ProductV2.objects.get(pk=int(t)))
        target.save()
        return target

    def update(self,instance, validated_data):
        for key in ['pk' , 'created','updated','targetAmount' ,'achievedCoin' ,'status' ,'product','validity']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'product' in self.context['request'].data:
            instance.product.clear()
            for t in self.context['request'].data['product']:
                instance.product.add(ProductV2.objects.get(pk = t))
        instance.save()
        return instance

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ('pk' , 'created','updated','user' ,'coin' ,'rate' )

    def create(self, validated_data):
        u = self.context['request'].user
        m = Wallet(**validated_data)
        m.user = u
        m.save()
        return m

    def update(self,instance, validated_data):
        u = self.context['request'].user
        for key in [ 'created','updated','user' ,'coin' ,'rate']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        instance.user = u
        instance.save()
        return instance

class GiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gift
        fields = ('pk' , 'created','updated','name' ,'image' ,'coins' ,'available' )
    def create(self, validated_data):
        g = Gift(**validated_data)
        g.save()
        return g
    def update(self,instance, validated_data):
        u = self.context['request'].user
        for key in ['pk' , 'created','updated','name' ,'coins' ,'available']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'image' in self.context['request'].data:
            if str(type(self.context['request'].data['image'])) != "<type 'unicode'>":
                instance.image = self.context['request'].data['image']
        instance.save()
        return instance


class WalletTransitionSerializer(serializers.ModelSerializer):
    gift = GiftSerializer(many = False , read_only = True)
    class Meta:
        model = WalletTransition
        fields = ('pk' , 'created','updated','user' ,'value' ,'type' ,'gift' )

    def create(self, validated_data):
        u = self.context['request'].user
        g = WalletTransition(**validated_data)
        g.user = u
        if 'gift' in self.context['request'].data:
            g.gift = Gift.objects.get(pk=int(self.context['request'].data['gift']))
        g.save()
        return g

    def update(self,instance, validated_data):
        u = self.context['request'].user
        for key in ['pk' , 'created','updated','user' ,'value' ,'type' ,'gift']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        instance.user = u
        if 'gift' in self.context['request'].data:
            instance.gift = Gift.objects.get(pk=int(self.context['request'].data['gift']))
        instance.save()
        return instance

class PagesV2Serializer(serializers.ModelSerializer):
    class Meta:
        model = PagesV2
        fields = ('pk' , 'created','updated','title' ,'pageurl' ,'body' ,'topLevelMenu','bottomMenu' ,'store' )

class offerBannerV2Serializer(serializers.ModelSerializer):
    page = PagesV2Serializer(many = False , read_only = True)
    class Meta:
        model = offerBannerV2
        fields = ('pk' , 'user' , 'created'  , 'level' , 'image' ,'imagePortrait' , 'title' , 'subtitle' , 'active' , 'page','store')
        read_only_fields = ('user',)
    def create(self ,  validated_data):
        u = self.context['request'].user
        b = offerBannerV2(**validated_data)
        b.user = u
        if 'page' in self.context['request'].data:
            b.page = PagesV2.objects.get(pk = self.context['request'].data['page'])
        b.save()
        return b
    def update(self ,instance, validated_data):
        for key in ['level' , 'image' ,'imagePortrait' , 'title' , 'subtitle' , 'active']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'page' in self.context['request'].data:
            instance.page = PagesV2.objects.get(pk = self.context['request'].data['page'])
        instance.save()
        return instance

class PromocodeV2Serializer(serializers.ModelSerializer):
    class Meta:
        model = PromocodeV2
        fields = ( 'pk', 'created' , 'updated', 'name' ,'endDate' , 'discount' , 'validTimes' , 'store')

class FaqCategoryV2Serializer(serializers.ModelSerializer):
    class Meta:
        model = FaqCategoryV2
        fields = ('pk' , 'created' ,'name','store')

class FrequentlyQuestionsV2Serializer(serializers.ModelSerializer):
    parent = FaqCategoryV2Serializer(many = False, read_only = True)
    category = serializers.SerializerMethodField()
    class Meta:
        model = FrequentlyQuestionsV2
        fields = ('pk' ,'created' , 'user' , 'ques' , 'ans','parent','category','store')
        read_only_fields = ('user',)
    def create(self , validated_data):
        f = FrequentlyQuestionsV2(**validated_data)
        f.user=self.context['request'].user
        if 'parent' in self.context['request'].data:
            faqObj = FaqCategoryV2.objects.get(pk = int(self.context['request'].data['parent']))
            f.parent = faqObj
        f.save()
        return f
    def update(self ,instance, validated_data):
        for key in ['pk' ,'created', 'ques' , 'ans']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        instance.user=self.context['request'].user
        if 'parent' in self.context['request'].data:
            faqObj = FaqCategoryV2.objects.get(pk = int(self.context['request'].data['parent']))
            instance.parent = faqObj
        instance.save()
        return instance
    def get_category(self, obj):
        return str(obj.parent.name)


class GroupV2Serializer(serializers.ModelSerializer):
    products = ProductV2Serializer(many = True , read_only = True)
    class Meta:
        model = GroupV2
        fields = ( 'pk', 'created' , 'name', 'store' ,  'products' )
    def create(self , validated_data):
        f = GroupV2(**validated_data)
        f.save()
        if 'products' in self.context['request'].data:
            for i in self.context['request'].data['products']:
                f.products.add(ProductV2.objects.get(pk = i))
        f.save()
        return f
    def update(self ,instance, validated_data):
        for key in ['pk' ,'created', 'name', 'store']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'products' in self.context['request'].data:
            instance.products.clear()
            for i in self.context['request'].data['products']:
                instance.products.add(ProductV2.objects.get(pk = i))
        instance.save()
        return instance

class VendorProfileSerializer(serializers.ModelSerializer):
    service = serviceSerializer(many = False , read_only = True)
    class Meta:
        model = VendorProfile
        fields = ('pk','created','updated','service','contactDoc','paymentTerm','contactPersonName','contactPersonNumber','contactPersonEmail')
    def create(self , validated_data):
        p = VendorProfile(**validated_data)
        p.service = service.objects.get(pk=self.context['request'].data['service'])

        try:
            p.save()
        except:
            raise ValidationError(detail={'PARAMS' : 'Service Profile already exists'} )
        return p



class VendorServicesSerializer(serializers.ModelSerializer):
    product = ProductV2Serializer(many = False , read_only = True)
    class Meta:
        model = VendorServices
        fields = ('pk','vendor','product','rate','fulfilmentTime','logistics')
        read_only_fields = ( 'vendor' , 'product')
    def create(self , validated_data):
        p = VendorServices(**validated_data)
        p.vendor = VendorProfile.objects.get(pk=self.context['request'].data['vendor'])
        p.product = Product.objects.get(pk=self.context['request'].data['product'])
        p.save()
        return p

class VendorServicesLiteSerializer(serializers.ModelSerializer):
    service = serviceSerializer(many = False , read_only = True)
    vendor = VendorProfileSerializer(many = False , read_only = True)
    class Meta:
        model = VendorServices
        fields = ('pk','vendor','product','rate','fulfilmentTime','logistics','service')
