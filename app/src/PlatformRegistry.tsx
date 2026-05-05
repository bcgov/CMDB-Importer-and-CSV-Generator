/*
• List Private Cloud Products	
https://registry.developer.gov.bc.ca/api/v1/private-cloud/products
• Get Private Cloud Product	
https://registry.developer.gov.bc.ca/api/v1/private-cloud/products/<id-or-licencePlate>
• List Public Cloud Products	
https://registry.developer.gov.bc.ca/api/v1/public-cloud/products
• Get Public Cloud Product	
https://registry.developer.gov.bc.ca/api/v1/public-cloud/products/<id-or-licencePlate>
*/

// 1. Get access token using client_credentials flow
const getToken = async ()=> {
const tokenResponse = await fetch(
  'https://loginproxy.gov.bc.ca/auth/realms/platform-services/protocol/openid-connect/token',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: '',     
      client_secret: '',     
    }),
  }
);

if (!tokenResponse.ok) {
  throw new Error(`Token request failed: ${tokenResponse.status} ${await tokenResponse.text()}`);
}

const { access_token } = await tokenResponse.json();
return access_token
}



export const getPlatformRegistryItems = async () => {
    const token = await getToken()

// 2. Call the private-cloud products API
const dataResponse = await fetch(
  'https://registry.developer.gov.bc.ca/api/v1/private-cloud/products',
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
);

if (!dataResponse.ok) {
  throw new Error(`API request failed: ${dataResponse.status} ${await dataResponse.text()}`);
}

const data = await dataResponse.json();
return data
}
