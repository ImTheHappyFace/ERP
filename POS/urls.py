from django.conf.urls import include, url
from .views import *
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'vendorProfile' , VendorProfileViewSet , base_name = 'vendorProfile')
router.register(r'vendorServices' , VendorServicesViewSet , base_name = 'vendorServices')
router.register(r'VendorServicesLite' , VendorServicesLiteViewSet , base_name = 'VendorServicesLite')
router.register(r'store' , StoreViewSet , base_name = 'store')
router.register(r'productMeta' , ProductMetaViewSet , base_name = 'productMeta')



# router.register(r'productInventory' , ProductInventoryViewSet , base_name = 'productInventory')

# version2##############################################################################
router.register(r'mediasv' , MediaV2ViewSet , base_name='mediasv')
router.register(r'categorysv' , CategoryV2ViewSet , base_name='categorysv')
router.register(r'productsv' , ProductV2ViewSet , base_name='productsv')
router.register(r'discountsv' , DiscountMatrixV2ViewSet , base_name='discountsv')
router.register(r'productVariantsv' , ProductVariantV2ViewSet , base_name='productVarientsv')
router.register(r'productlitesv' , ProductV2LiteViewSet , base_name='productsvlite')
router.register(r'target' , TargetViewSet , base_name='target')
router.register(r'wallet' , WalletViewSet , base_name='wallet')
router.register(r'gift' , GiftViewSet , base_name='gift')
router.register(r'wallettransition' , WalletTransitionViewSet , base_name='wallettransition')
router.register(r'pagesvs' , PagesV2ViewSet , base_name='pagesvs')
router.register(r'offerBannervs' , offerBannerV2ViewSet , base_name='offerBannervs')
router.register(r'promocodevs' , PromocodeV2ViewSet , base_name='promocodevs')
router.register(r'faqCategoryvs' , FaqCategoryV2ViewSet , base_name='faqCategoryvs')
router.register(r'frequentlyquestionvs' , FrequentlyQuestionsV2ViewSet , base_name='frequentlyquestionvs')
router.register(r'groupvs' , GroupV2ViewSet , base_name='groupvs')







urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'invoicePrint/$' , InvoicePrint.as_view() ),
    url(r'productPrint/$' , ProductPrint.as_view() ),
    url(r'productPrintGrns/$' , ProductPrintGrns.as_view() ),
    url(r'bulkProductsCreation/$' , BulkProductsCreationAPIView.as_view() ),
    url(r'externalEmailOrders/$' , ExternalEmailOrders.as_view() ),
    url(r'reorderingReport/$' , ReorderingReport.as_view() ),
    url(r'stockReport/$' , StockReport.as_view() ),
    url(r'getNextAvailableInvoiceID/$' , GetNextAvailableInvoiceIDAPIView.as_view() ),
    url(r'salesGraphAPI/$' , SalesGraphAPIView.as_view() ),
    url(r'externalSalesGraphAPI/$' , ExternalSalesGraphAPIView.as_view() ),
    url(r'productInventoryAPI/$' , ProductInventoryAPIView.as_view() ),
    url(r'getTaxList/$' , GetTaxList.as_view() ),
    url(r'addProductSKU/$' , AddProductSKU.as_view() ),
    url(r'posInvoicePrinter/$' , PosInvoicePrinter.as_view()),
    url(r'saveToEcommerce/$' , SaveToEcommerceAPIView.as_view()),
    url(r'saveToEcommerce/$' , SaveToEcommerceAPIView.as_view()),
    url(r'bulkInventoryCreation/$' , BulkInventoryCreationAPIView.as_view()),
    url(r'bulkInventoryDeduction/$' , BulkInventoryDeductionAPIView.as_view()),
    url(r'bulkProductMetaCreation/$' , BulkProductMetaAPIView.as_view()),
    url(r'productInventoryTotalAPI/$' , ProductInventoryTotalAPIView.as_view()),
    url(r'printInvoice/$' , PrintAPIView.as_view()),
    url(r'saveProduct/$' , ProductApiViewV2.as_view()),


    # url(r'^createStoreCredit', createStoreCredit , name ='createStoreCredit'),


    # url(r'getTaxListExcel/$' , GetTaxListExcel.as_view() ),

]
