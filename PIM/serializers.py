from django.contrib.auth.models import User , Group
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import *
from .models import *
# from social.serializers import commentLikeSerializer
# from social.models import commentLike
# from clientRelationships.serializers import ContactLiteSerializer
# from ecommerce.models import listing , media , Cart
# from POS.models import Product,Store,StoreQty
from ERP.serializers import serviceLiteSerializer , serviceSerializer , addressSerializer

class themeSerializer(serializers.ModelSerializer):
    class Meta:
        model = theme
        fields = ( 'pk' , 'main' , 'highlight' , 'background' , 'backgroundImg')

class settingsSerializer(serializers.ModelSerializer):
    theme = themeSerializer(many = False , read_only = True)
    class Meta:
        model = settings
        fields = ('pk' , 'user', 'theme', 'presence')

class notificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = notification
        fields = ('pk' , 'message' ,'shortInfo','domain','onHold', 'link' , 'originator' , 'created' ,'updated' , 'read' , 'user')

class ContactLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ('pk' , 'user' ,'name', 'company', 'email', 'mobile' , 'designation', 'dp', 'male')
        read_only_fields = ( 'user' ,'name', 'company', 'email', 'mobile' , 'designation', 'dp', 'male')


class ContactSerializer(serializers.ModelSerializer):
    company = serviceSerializer(many = False , read_only = True)
    class Meta:
        model = Contact
        fields = ('pk' , 'user' ,'name', 'created' , 'updated' , 'company', 'email' , 'emailSecondary', 'mobile' , 'mobileSecondary' , 'designation' , 'notes' , 'linkedin', 'facebook', 'dp', 'male')
        read_only_fields = ('user', )
    def create(self , validated_data):
        c = Contact(**validated_data)
        c.user = self.context['request'].user
        if 'company' in self.context['request'].data:
            c.company_id = int(self.context['request'].data['company'])
        c.save()
        return c
    def update(self ,instance, validated_data):
        for key in ['name', 'email' , 'emailSecondary', 'mobile' , 'mobileSecondary' , 'designation' , 'notes' , 'linkedin', 'facebook', 'dp', 'male']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'company' in self.context['request'].data:
            instance.company_id = int(self.context['request'].data['company'])
        instance.save()
        return instance

class calendarSerializer(serializers.ModelSerializer):
    # clients = ContactLiteSerializer(many = True , read_only = True)
    class Meta:
        model = calendar
        fields = ('pk' , 'eventType' , 'followers' ,'originator', 'duration' , 'created', 'updated', 'user' , 'text' , 'notification' ,'when' , 'read' , 'deleted' , 'completed' , 'canceled' , 'level' , 'venue' , 'attachment' , 'myNotes', 'data')
        read_only_fields = ('followers', 'user' )
    def create(self , validated_data):
        cal = calendar(**validated_data)
        cal.user = self.context['request'].user
        cal.save()
        if 'followers' in  self.context['request'].data:
            tagged = self.context['request'].data['followers']
            if not isinstance(tagged , list):
                for tag in tagged.split(','):
                    cal.followers.add( User.objects.get(pk = tag))
            else:
                for tag in tagged:
                    cal.followers.add( User.objects.get(pk = tag))

        # if 'clients' in  self.context['request'].data:
        #     clients = self.context['request'].data['clients']
        #     for c in clients:
        #         cal.clients.add( Contact.objects.get(pk = c))
        cal.save()
        return cal
    def update(self, instance, validated_data): # like the comment
        for key in ['eventType', 'duration' , 'text' ,'when' , 'read' , 'deleted' , 'completed' , 'canceled' , 'level' , 'venue' , 'attachment' , 'myNotes', 'data']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        instance.followers.clear()
        if 'followers' in  self.context['request'].data:
            tagged = self.context['request'].data['followers']
            if not isinstance(tagged , list):
                for tag in tagged.split(','):
                    instance.followers.add( User.objects.get(pk = tag))
            else:
                for tag in tagged:
                    instance.followers.add( User.objects.get(pk = tag))
        instance.save()
        return instance

class chatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = chatMessage
        fields = ('pk' , 'message' ,'attachment', 'originator' , 'created' , 'read' , 'user')
        read_only_fields = ('originator' , )
    def create(self , validated_data):
        im = chatMessage.objects.create(**validated_data)
        im.originator = self.context['request'].user
        try:
            im.attachment = self.context['request'].FILES['attachment']
        except:
            pass
        if im.originator == im.user:
            im.delete()
            raise ParseError(detail=None)
        else:
            im.save()
            return im


class blogLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = blogLike
        fields = ('pk' , 'user' , 'created' , 'parent')
    def create(self , validated_data):
        parent = validated_data.pop('parent')
        user =  self.context['request'].user
        l, new = blogLike.objects.get_or_create(parent = parent , user = user)
        return l

class blogCommentLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = blogCommentLike
        fields = ('pk' , 'user' , 'created' , 'parent')
    def create(self , validated_data):
        parent = validated_data.pop('parent')
        user =  self.context['request'].user
        l, new = blogLike.objects.get_or_create(parent = parent , user = user)
        return l

class blogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = blogCategory
        fields = ('pk', 'title' )

class blogCommentsSerializer(serializers.ModelSerializer):
    likes = blogCommentLikeSerializer(many = True , read_only = True)
    class Meta:
        model = blogComment
        fields = ('pk' , 'user' , 'parent' , 'created' , 'text' , 'likes')
        read_only_fields = ('tagged', 'likes',)
    def create(self , validated_data):
        text = validated_data.pop('text')
        parent = validated_data.pop('parent')
        user =  self.context['request'].user
        comment = blogComment(text = text , parent = parent , user = user)
        comment.save()
        return comment
    def update(self, instance, validated_data): # like the comment
        user =  self.context['request'].user
        # print commentLike.parent.__class__
        l , new = blogCommentLike.objects.get_or_create(user = user , parent = instance)
        return instance

# class mediaSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = media
#         fields = ('pk' , 'link' , 'attachment' , 'mediaType')

# class StoreSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Store
#         fields = ('pk' ,'name' , 'pincode' , 'mobile' , 'email')

# class StoreQtySerializer(serializers.ModelSerializer):
#     store = StoreSerializer(many = False , read_only = True)
#     class Meta:
#         model = StoreQty
#         fields = ('pk' , 'store' , 'quantity' )

# class ProductSerializer(serializers.ModelSerializer):
#     # storeQty=StoreQtySerializer(many=True,read_only=True)
#     discountedPrice = serializers.SerializerMethodField()
#     class Meta:
#         model = Product
#         fields = ('pk' , 'user' ,'name' , 'price' , 'discount','discountedPrice' ,'description','inStock','storeQty')
#     def get_discountedPrice(self, obj):
#         if obj.discount>0:
#             discountedPrice =  obj.price - (obj.discount / 100.00 ) *  obj.price
#             return discountedPrice
#         else:
#             return obj.price
#
# class BlogListingSerializer(serializers.ModelSerializer):
#     files = mediaSerializer(many = True , read_only = True)
#     product = ProductSerializer(many = False , read_only = True)
#     added_cart = serializers.SerializerMethodField()
#     added_saved = serializers.SerializerMethodField()
#     class Meta:
#         model = listing
#         fields = ('pk' , 'user' , 'product' , 'files','added_cart','added_saved')
#     def get_added_cart(self , obj):
#         if self.context['request'].user.is_authenticated:
#             cart = Cart.objects.filter(product=obj.pk,user=self.context['request'].user,typ='cart')
#             if cart.count()>0:
#                 return cart[0].qty
#             else:
#                 return cart.count()
#         else:
#             return 0
    #
    # def get_added_saved(self , obj):
    #     if self.context['request'].user.is_authenticated:
    #         return Cart.objects.filter(product=obj.pk,user=self.context['request'].user,typ='favourite').count()
    #     else:
    #         return 0

class blogSerializer(serializers.ModelSerializer):
    likes = blogLikeSerializer(many = True , read_only = True)
    comments = blogCommentsSerializer(many = True , read_only = True)
    tags = blogCategorySerializer(many = True , read_only = True)
    # suggestedProducts = BlogListingSerializer(many = True , read_only = True)
    class Meta:
        model = blogPost
        fields = ( 'pk' ,'public', 'source' , 'likes' , 'comments' , 'created' , 'sourceFormat' , 'users' , 'tags' , 'title' , 'header' , 'state' , 'contentType' , 'shortUrl' , 'ogimageUrl' , 'ogimage' , 'description', 'tagsCSV','section' , 'author','suggestedProducts')
        read_only_fields = ('tags', 'users')
    def create(self , validated_data):
        print "Saved1"
        b = blogPost(**validated_data)
        for key in ['source', 'sourceFormat', 'title' , 'header' , 'state']:
            try:
                setattr(b , key , validated_data[key])
            except:
                pass
        b.save()
        print "Saved"
        b.users.add(self.context['request'].user)
        for tag in self.context['request'].data['tags']:
            b.tags.add(blogCategory.objects.get(pk = tag))
        # if 'suggestedProducts' in self.context['request'].data:
        #     ps = self.context['request'].data['suggestedProducts']
        #     if not isinstance(ps , list) and len(ps)>0:
        #         for product in ps.split(','):
        #             b.suggestedProducts.add(listing.objects.get(pk = int(product)))
        #     else:
        #         for product in ps:
        #             b.suggestedProducts.add(listing.objects.get(pk = int(product)))

        b.save()
        return b

    def update(self, instance, validated_data): # like the comment
        for key in ['public', 'source' , 'sourceFormat' , 'title' , 'header' , 'state' , 'contentType' , 'shortUrl' , 'ogimageUrl' , 'ogimage' , 'description', 'tagsCSV','section' , 'author']:
            try:
                setattr(instance , key , validated_data[key])
            except:
                pass
        if 'users' in  self.context['request'].data:
            instance.users.clear()
            instance.users.add(self.context['request'].user)

        if 'tags' in self.context['request'].data:
            instance.tags.clear()
            for tag in self.context['request'].data['tags']:
                instance.tags.add(blogCategory.objects.get(pk = tag))
        #
        # if 'suggestedProducts' in self.context['request'].data:
        #     instance.suggestedProducts.clear()
        #     ps = self.context['request'].data['suggestedProducts']
        #     if not isinstance(ps , list) and len(ps)>0:
        #         for product in ps.split(','):
        #             instance.suggestedProducts.add(listing.objects.get(pk = int(product)))
        #     else:
        #         for product in ps:
        #             instance.suggestedProducts.add(listing.objects.get(pk = int(product)))

        instance.save()
        return instance


class notebookSerializer(serializers.ModelSerializer):
    class Meta:
        model = notebook
        fields = ('pk' , 'user', 'created' , 'pages' , 'title')
        read_only_fields = ('pages' , )
    def create(self , validated_data):
        n = notebook.objects.create(**validated_data)
        n.user = self.context['request'].user
        n.save()
        return n
    def update(self, instance, validated_data): # like the comment
        instance.title = validated_data['title']
        instance.save()
        return instance

class pageSerializer(serializers.ModelSerializer):
    class Meta:
        model = page
        fields = ('pk' , 'user', 'source' , 'parent' , 'title')
    def create(self , validated_data):
        p = page.objects.create(**validated_data)
        p.user = self.context['request'].user
        p.save()
        return p
    def update(self, instance, validated_data): # like the comment
        instance.title = validated_data['title']
        instance.source = validated_data['source']
        instance.save()
        return instance
