from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings as globalSettings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from homepage.views import index
# from events.views import eventHome
from HR.views import loginView , logoutView , home , registerView , tokenAuthentication , root, generateOTP, documentView, socialMobileView, tokenView,mobileloginView
from homepage.views import blog,blogDetails,news,team, career ,policy ,terms ,refund , contacts , registration, desclaimer,vendorregistration,setupstore
from ecommerce.views import *
from ERP.views import serviceRegistration , makeOnlinePayment

app_name="libreERP"
urlpatterns = [
    url(r'^$', ecommerceHome , name ='root'),
    url(r"^ecommerce/", ecommerceHome , name = 'ecommerce'), # public  ecommerce app
    url(r'^ERP/', home , name ='ERP'),
    url(r'^api/', include('API.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^login', loginView , name ='login'),
    url(r'^mobilelogin', mobileloginView , name ='mobilelogin'),
    url(r'^t', tokenView , name ='t'),
    url(r'^register', registration , name ='register'),
    url(r'^vendor-registeration', vendorregistration , name ='vendorregistration'),
    url(r'^services', serviceRegistration , name ='serviceRegistration'),
    url(r'^token', tokenAuthentication , name ='tokenAuthentication'),
    url(r'^logout', logoutView , name ='logout'),
    url(r'^corporate/', index , name ='index'),
    url(r'^api-auth/', include('rest_framework.urls', namespace ='rest_framework')),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^robots\.txt', include('robots.urls')),
    url(r'^generateOTP', generateOTP, name="generateOTP"),
    url(r'^documents', documentView , name ='document'),
    url(r'^paypal/', include('paypal.standard.ipn.urls')),
    url(r'paypalPaymentInitiate/$' , paypalPaymentInitiate , name = "paypalPaymentInitiate" ),
    url(r'paypal_return_view/$' , paypal_return_view , name = "paypal_return_view" ),
    url(r'paypal_cancel_view/$' , paypal_cancel_view , name = "paypal_cancel_view" ),
    url(r'makeOnlinePayment/$' , makeOnlinePayment , name = "makeOnlinePayment" ),
    url(r'payuPaymentInitiate/$' , payuPaymentInitiate , name = "paypalPaymentInitiate" ),
    url(r'payuMoneyInitiate/$' , payuMoneyInitiate , name = "payuMoneyInitiate" ),
    url(r'payUPaymentResponse/$' , payUPaymentResponse , name = "paypalPaymentInitiate" ),
    url(r'^socialMobileLogin/$', socialMobileView , name ='socialMobileLogin'),
    url(r'^ebsPaymentResponse/', ebsPaymentResponse , name ='ebsPaymentResponse'),
    url(r'^ccavenuePaymentInitiate/', ccavenuePaymentInitiate , name ='ccavenuePaymentInitiate'),
    url(r'^ccavenuePaymentResponse/', ccavenuePaymentResponse , name ='ccavenuePaymentResponse'),
    url(r'^store/(?P<store>[\w|\W]+)/', ecommerceStore , name ='storeDetails'),
    url(r'^setupStore', setupstore , name ='setupstore'),
    # url(r'^partner/signup', Pratnerregisteration , name ='Pratnerregisteration'),
    # url(r'^orderSuccessful/', ccavenuePaymentResponse , name ='ccavenuePaymentResponse'),

]

if globalSettings.DEBUG:
    urlpatterns +=static(globalSettings.STATIC_URL , document_root = globalSettings.STATIC_ROOT)
    urlpatterns +=static(globalSettings.MEDIA_URL , document_root = globalSettings.MEDIA_ROOT)

urlpatterns.append(url(r'^', ecommerceHome , name ='ecommerceHome'))
