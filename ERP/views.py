from django.contrib.auth.models import User , Group
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate , login , logout
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.template import RequestContext
from django.conf import settings as globalSettings
# Related to the REST Framework
from rest_framework import viewsets , permissions , serializers
from rest_framework.exceptions import *
from url_filter.integrations.drf import DjangoFilterBackend
from .serializers import *
from API.permissions import *
from django.db.models import Q
from allauth.account.adapter import DefaultAccountAdapter
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
import requests
import libreERP.Checksum as Checksum
from django.views.decorators.csrf import csrf_exempt
import urllib
import hashlib
import sendgrid
import os
import random,string

def randompassword():
    length =20
    chars = string.ascii_letters + string.digits +'!@$%^&*()'
    rnd = random.SystemRandom()
    return ''.join(random.choice(chars) for x in range(length))


def makeOnlinePayment(request):
    if globalSettings.PAYMENT_MODE == 'EBS':
        return redirect("/api/ERP/ebsPayment/?orderid=" + request.GET['orderid'])
    elif globalSettings.PAYMENT_MODE == 'paypal':
        return redirect("/paypalPaymentInitiate/?orderid=" + request.GET['orderid'])
    elif globalSettings.PAYMENT_MODE == 'PAYU':
        return redirect("/payuPaymentInitiate/?orderid=" + request.GET['orderid'])


from django.http import HttpResponse
import requests
# from ecommerce.models import Order
class MakeEBSPayment(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.IsAuthenticated ,)
    def get(self , request , format = None):
        MERCHANT_KEY = globalSettings.PAYTM_MERCHANT_KEY
        # order = Order.objects.get(pk = request.GET['orderid'])
        # data_dict = {
        #             'channel':'0',
        #             'account_id':'19591',
        #             'reference_no': request.GET['orderid'],
        #             'amount': order.totalAmount,
        #             'mode': globalSettings.EBS_PAYMENT_MODE,
        #             'currency': 'INR',
        #             'description':'BNI India products ',
        #             'return_url': globalSettings.SITE_ADDRESS + '/ebsPaymentResponse/',
        #             'name': request.user.first_name,
        #             'address': order.street,
        #             'city':order.city,
        #             'state':order.state,
        #             'country' : 'IN',
        #             'postal_code':order.pincode,
        #             'phone': order.user.profile.mobile,
        #             'email': order.user.email,
        #             'cust_email': globalSettings.G_ADMIN[0]
        #         }
        param_dict = data_dict

        hashVal = 'b47b8d9994e3356cf3c841ce9e025089'

        for key in sorted(param_dict.iterkeys()):
            print (("{} --> {}").format(key, param_dict[key]))
            hashVal += '|' + str(param_dict[key])


        m = hashlib.md5()
        m.update(hashVal)
        param_dict['secure_hash'] = m.hexdigest().upper()

        # res = requests.post('https://secure.ebs.in/pg/ma/payment/request', data = param_dict)

        # print res.headers
        # print res.text



        # return HttpResponse(res.text)
        return render(request, "ebs.payment.html" , {'data' : param_dict} )


class SendSMSApi(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (permissions.AllowAny ,)
    def post(self , request , format = None):
        print "came"
        if 'number' not in request.data or 'text' not in request.data:
            return Response(status = status.HTTP_400_BAD_REQUEST)
        else:
            try:
                url = globalSettings.SMS_API_PREFIX + 'mobiles=%s&message=%s'%(request.data['number'] , request.data['text'])
            except:
                url = globalSettings.SMS_API_PREFIX + 'number=%s&message=%s'%(request.data['number'] , request.data['text'])
            # print url
            requests.get(url)
            return Response(status = status.HTTP_200_OK)

def serviceRegistration(request): # the landing page for the vendors registration page
    return render(request , 'app.ecommerce.register.partner.html')

class serviceRegistrationApi(APIView):
    permission_classes = (permissions.AllowAny ,)

    def get(self, request , format = None):
        u = request.user
        if service.objects.filter(user = u).count() == 0:
            return Response(status = status.HTTP_404_NOT_FOUND)
        else:
            print service.objects.get(user = u).pk
        return Response(status = status.HTTP_200_OK)


    def post(self, request, format=None):
        u = request.user
        if not u.is_anonymous():
            if service.objects.filter(user = u).count() == 0:
                cp = customerProfile.objects.get(user = u)
                ad = cp.address
                if cp.mobile is None:
                    if 'mobile' in request.data:
                        mob = request.data['mobile']
                    else:
                        return Response({'mobile' : 'No contact number found in the account'}, status = status.HTTP_400_BAD_REQUEST)
                else:
                    mob = cp.mobile
                s = service(name = u.get_full_name() , user = u , cin = 0 , tin = 0 , address = ad , mobile = mob, telephone = mob , about = '')
            else:
                s = service.objects.get(user = u)
            s.save()
            add_application_access(u , ['app.ecommerce' , 'app.ecommerce.orders' , 'app.ecommerce.offerings','app.ecommerce.earnings'] , u)
            return Response( status = status.HTTP_200_OK)

        first_name = request.data['first_name']
        last_name = request.data['last_name']
        email = request.data['email']
        password = request.data['password']

        # serviceForm1 data
        name = request.data['name'] # company's name
        cin = request.data['cin']
        tin = request.data['tin']
        mobile = request.data['mobile']
        telephone = request.data['telephone']

        # serviceForm2 data
        street = request.data['street']
        pincode = request.data['pincode']
        city = request.data['city']
        state = request.data['state']
        about = request.data['about']

        if User.objects.filter(email = email).exists():
            content = { 'email' : 'Email ID already exists' }
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        else:
            user = User.objects.create(username = email.replace('@' , '').replace('.' ,''))
            user.first_name = first_name
            user.last_name = last_name
            user.email = email
            user.set_password(password)
            user.is_active = False
            user.save()
            ad = address(street = street , city = city , state = state , pincode = pincode )
            ad.save()
            se = service(name = name , user = user , cin = cin , tin = tin , address = ad , mobile = mobile, telephone = telephone , about = about)
            se.save()

            salt = hashlib.sha1(str(random.random())).hexdigest()[:5]
            activation_key = hashlib.sha1(salt+email).hexdigest()
            key_expires = datetime.datetime.today() + datetime.timedelta(2)

            ak = accountsKey(user=user, activation_key=activation_key,
                key_expires=key_expires)
            link = globalSettings.SITE_ADDRESS + '/token/?key=%s' % (activation_key)
            ctx = {
                'logoUrl' : 'http://design.ubuntu.com/wp-content/uploads/ubuntu-logo32.png',
                'heading' : 'Welcome',
                'recieverName' : user.first_name,
                'message': 'Thanks for signing up. To activate your account, click this link within 48hours',
                'linkUrl': link,
                'linkText' : 'Activate',
                'sendersAddress' : 'Street 101 , State, City 100001',
                'sendersPhone' : '129087',
                'linkedinUrl' : 'linkedin.com',
                'fbUrl' : 'facebook.com',
                'twitterUrl' : 'twitter.com',
            }

            # Send email with activation key
            email_subject = 'Account confirmation'
            email_body = get_template('app.ecommerce.email.html').render(ctx)
            if globalSettings.EMAIL_API:
                sg = sendgrid.SendGridAPIClient(apikey= globalSettings.G_KEY)
                # sg = sendgrid.SendGridAPIClient(apikey=os.environ.get('SENDGRID_API_KEY'))
                data = {
                  "personalizations": [
                    {
                      "to": [
                        {
                          "email": email
                          # str(orderObj.user.email)
                        }
                      ],
                      "subject": email_subject
                    }
                  ],
                  "from": {
                    "email": globalSettings.G_FROM,
                    "name":"BNI India"
                  },
                  "content": [
                    {
                      "type": "text/html",
                      "value": email_body
                    }
                  ]
                }
                response = sg.client.mail.send.post(request_body=data)
                print(response.body,"bodyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
            else:
                msg = EmailMessage(email_subject, email_body, to= [email] , from_email= 'pkyisky@gmail.com' )
                msg.content_subtype = 'html'
                msg.send()
            content = {'pk' : user.pk , 'username' : user.username , 'email' : user.email}
            ak.save()
            return Response(content , status = status.HTTP_200_OK)

class addressViewSet(viewsets.ModelViewSet):
    permission_classes = (isAdmin , )
    serializer_class = addressSerializer
    def get_queryset(self):
        u = self.request.user
        has_application_permission(u , ['app.ecommerce' , 'app.ecommerce.orders'])
        return address.objects.all()

class serviceViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated , )
    serializer_class = serviceSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['name']
    def get_queryset(self):
        u = self.request.user
        return service.objects.all()

class deviceViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = deviceSerializer
    queryset = device.objects.all()

class profileViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = profileSerializer
    queryset = profile.objects.all()
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['id']



class AccountAdapter(DefaultAccountAdapter):

    def get_login_redirect_url(self, request):
        for a in globalSettings.DEFAULT_APPS_ON_REGISTER:
            app = application.objects.get(name = a)
            p = permission.objects.create(app =  app, user = request.user , givenBy = User.objects.get(pk=1))
        return globalSettings.ON_REGISTRATION_SUCCESS_REDIRECT

        # here we can know the device agent , or something to identify the app
        # redirect to happypocets.in/t/LKr8PiOTcILfeLgRxYA1
        # on the app login with this token  https://app.syrow.com/tlogin//?token=LKr8PiOTcILfeLgRxYA1&mode=api

def getModules(user , includeAll=False):
    if user.is_superuser:
        if includeAll:
            return module.objects.all()
        else:
            return module.objects.filter(~Q(name='public'))
    else:
        ma = []
        for m in application.objects.filter(owners__in = [user,]).values('module').distinct():
            ma.append(m['module'])
        aa = []
        for a in user.accessibleApps.all().values('app'):
            aa.append(a['app'])
        for m in application.objects.filter(pk__in = aa).values('module').distinct():
            ma.append(m['module'])
        return module.objects.filter(pk__in = ma)

class moduleViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = module.objects.all()
    serializer_class = moduleSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['name']
    def get_queryset(self):
        includeAll = False
        if 'mode' in self.request.GET:
            if self.request.GET['mode'] == 'search':
                includeAll = True
        u = self.request.user
        return getModules(u , includeAll)

def getApps(user):
    aa = []
    for a in user.accessibleApps.all().values('app'):
        aa.append(a['app'])
    if user.appsManaging.all().count()>0:
        try:
            if appSettingsField.objects.get(app=25,name='multipleStore').flag:
                return application.objects.filter(pk__in = aa).exclude(pk__in = user.appsManaging.all().values('pk')).exclude(module = module.objects.get(name = 'public')) | user.appsManaging.all()
            else:
                return application.objects.filter(pk__in = aa).exclude(pk__in = user.appsManaging.all().values('pk')).exclude(module = module.objects.get(name = 'public')).exclude(name='app.productsInventory.store') | user.appsManaging.all()
        except:
            return application.objects.filter(pk__in = aa).exclude(pk__in = user.appsManaging.all().values('pk')).exclude(module = module.objects.get(name = 'public')) | user.appsManaging.all()
    try:
        if appSettingsField.objects.get(app=25,name='multipleStore').flag:
            return application.objects.filter(pk__in = aa)
        else:
            return application.objects.filter(pk__in = aa).exclude(name='app.productsInventory.store')
    except:
        return application.objects.filter(pk__in = aa)


class applicationViewSet(viewsets.ModelViewSet):
    permission_classes = (readOnly,)
    serializer_class = applicationSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['name' , 'module']
    def get_queryset(self):
        u = self.request.user
        if not u.is_superuser:
            return getApps(u)
        else:
            if 'user' in self.request.GET:
                return getApps(User.objects.get(username = self.request.GET['user']))
            try:
                if appSettingsField.objects.get(app=25,name='multipleStore').flag:
                    return application.objects.filter()
                else:
                    return application.objects.filter().exclude(name='app.productsInventory.store')
            except:
                return application.objects.filter()

class applicationAdminViewSet(viewsets.ModelViewSet):
    permission_classes = (isAdmin,)
    serializer_class = applicationAdminSerializer
    # queryset = application.objects.all()
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['name']
    def get_queryset(self):
        if not self.request.user.is_superuser:
            raise PermissionDenied(detail=None)
        return application.objects.all()


class applicationSettingsViewSet(viewsets.ModelViewSet):
    permission_classes = (readOnly , )
    queryset = appSettingsField.objects.all()
    serializer_class = applicationSettingsSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['app' , 'name']

class applicationSettingsAdminViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = appSettingsField.objects.all()
    serializer_class = applicationSettingsAdminSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['app' , 'name']


class groupPermissionViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = groupPermission.objects.all()
    serializer_class = groupPermissionSerializer

class permissionViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = permission.objects.all()
    serializer_class = permissionSerializer
