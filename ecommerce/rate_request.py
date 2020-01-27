#!/usr/bin/env python
"""
This example shows how to use the FedEx RateRequest service.
The variables populated below represents the minimum required values.
You will need to fill all of these, or risk seeing a SchemaValidationError
exception thrown by suds.

TIP: Near the bottom of the module, see how to check the if the destination
     is Out of Delivery Area (ODA).
"""
import logging
import sys

# from fedex_config import CONFIG_OBJ
# from fedex.services.rate_service import FedexRateServiceRequest
# from fedex.tools.conversion import sobject_to_dict

logging.basicConfig(stream=sys.stdout, level=logging.INFO)


def getShipmentCharges( pincode , countryCode , weight):

    customer_transaction_id = "BNISTORE"  # Optional transaction_id
    rate_request = FedexRateServiceRequest(CONFIG_OBJ, customer_transaction_id=customer_transaction_id)
    rate_request.RequestedShipment.DropoffType = 'REGULAR_PICKUP'
    # rate_request.RequestedShipment.ServiceType = 'FEDEX_EXPRESS_SAVER'
    rate_request.RequestedShipment.PackagingType = 'YOUR_PACKAGING'
    rate_request.RequestedShipment.EdtRequestType = 'NONE'
    rate_request.RequestedShipment.ShippingChargesPayment.PaymentType = 'SENDER'


    # Shipper's address
    rate_request.RequestedShipment.Shipper.Address.PostalCode = '560068'
    rate_request.RequestedShipment.Shipper.Address.CountryCode = 'IN'
    rate_request.RequestedShipment.Shipper.Address.Residential = False

    # Recipient address
    rate_request.RequestedShipment.Recipient.Address.PostalCode = pincode
    rate_request.RequestedShipment.Recipient.Address.CountryCode = countryCode

    package1_weight = rate_request.create_wsdl_object_of_type('Weight')
    package1_weight.Value = weight
    package1_weight.Units = "LB"
    package1 = rate_request.create_wsdl_object_of_type('RequestedPackageLineItem')
    package1.Weight = package1_weight
    package1.PhysicalPackaging = 'ENVELOPE'
    package1.GroupPackageCount = 1
    rate_request.add_package(package1)
    rate_request.send_request()

    print("HighestSeverity: {}".format(rate_request.response.HighestSeverity))

    for service in rate_request.response.RateReplyDetails:
        # for detail in service.RatedShipmentDetails:
        #     for surcharge in detail.ShipmentRateDetail.Surcharges:
        #         if surcharge.SurchargeType == 'OUT_OF_DELIVERY_AREA':
        #             print("{}: ODA rate_request charge {}".format(service.ServiceType, surcharge.Amount.Amount))

        for rate_detail in service.RatedShipmentDetails:
            print("{}: Net FedEx Charge {} {}".format(service.ServiceType,
                                                      rate_detail.ShipmentRateDetail.TotalNetFedExCharge.Currency,
                                                      rate_detail.ShipmentRateDetail.TotalNetFedExCharge.Amount))

    # Check for warnings, this is also logged by the base class.
    if rate_request.response.HighestSeverity == 'NOTE':
        for notification in rate_request.response.Notifications:
            if notification.Severity == 'NOTE':
                print(sobject_to_dict(notification))

    return rate_detail.ShipmentRateDetail.TotalNetFedExCharge.Amount/70


if __name__ == '__main__':

    charge = getShipmentCharges('27577' , 'US' , 1)
    print "Charge : " , charge
