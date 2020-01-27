"""
This file holds various configuration options used for all of the examples.
You will need to change the values below to match your test account.
"""
import os
import sys

# Use the fedex directory included in the downloaded package instead of
# any globally installed versions.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# from fedex.config import FedexConfig
from django.conf import settings as globalSettings



# Change these values to match your testing account/meter number.
# CONFIG_OBJ = FedexConfig(key= globalSettings.FEDEX_AUTH_KEY ,
#                          password=  globalSettings.FEDEX_PASSWORD,
#                          account_number=  globalSettings.FEDEX_ACCOUNT_NUMBER ,
#                          meter_number=  globalSettings.FEDEX_METER_NUMBER,
#                          # freight_account_number='510087020',
# use_test_server= globalSettings.FEDEX_TEST_MODE)


# CONFIG_OBJ = FedexConfig(key= 'abOhatnikLWCa8Hj' ,
#                          password= 'Yk1agUkfxS1P3ABNemVGYJFOB',
#                          account_number= '870648022' ,
#                          meter_number= '113921415',
#                          # freight_account_number='510087020',
# use_test_server=False)
