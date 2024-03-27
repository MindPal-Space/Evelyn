import axios from 'axios';

interface LSLicenseResponse {
  activated: boolean;
  error?: string;
  license_key: {
    id: number;
    status: string;
    key: string;
    activationLimit: number;
    activationUsage: number;
    created_at: string;
    expires_at?: string;
  };
  instance: {
    id: string;
    name: string;
    created_at: string;
  };
  meta: {
    store_id: number;
    order_id: number;
    order_item_id: number;
    product_id: number;
    product_name: string;
    variant_id: number;
    variant_name: string;
    customer_id: number;
    customer_name: string;
    customer_email: string;
  };
}

export const activateLicenseKey = async (licenseKey: string) => {

  const url = 'https://api.lemonsqueezy.com/v1/licenses/activate';

  const data = {
    license_key: licenseKey,
    instance_name: 'Official'
  };

  const headers = {
    Accept: 'application/json'
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data as LSLicenseResponse

  } catch (error) {
    console.error(error);
  }

};

export const validateLicenseKey = async (licenseKey: string) => {

  const url = 'https://api.lemonsqueezy.com/v1/licenses/validate';

  const data = {
    license_key: licenseKey,
  };

  const headers = {
    Accept: 'application/json'
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data as LSLicenseResponse

  } catch (error) {
    console.error(error);
  }

};

export async function updateSubscriptionItemQuantity({
  itemId, quantity, apiKey,
} : {
  itemId: string, quantity: number, apiKey: string
}): Promise<string> {

  const apiUrl = `https://api.lemonsqueezy.com/v1/subscription-items/${itemId}`;

  const patchData = {
    data: {
      type: 'subscription-items',
      id: itemId,
      attributes: {
        quantity: quantity,
      },
    },
  };

  const headers = {
    Accept: 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
    Authorization: `Bearer ${apiKey}`,
  };

  try {
    await axios.patch(apiUrl, patchData, { headers });
    return 'Success';
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
