# VercelService

The `VercelService` class provides methods to interact with the Vercel API for domain management and deployment.

## Methods

### `addDomainToVercel(domain: string): Promise<any>`

Adds a domain to a Vercel project.

- **Parameters:**
  - `domain` (string): The domain name to be added.
- **Returns:** The response data from the Vercel API or an error object.

### `vercelDomainDNSVerification(domain: string): Promise<any>`

Verifies the DNS configuration of a domain in Vercel.

- **Parameters:**
  - `domain` (string): The domain name to be verified.
- **Returns:** The DNS configuration data and subdomain information.

### `vercelRedeploy(): Promise<any>`

Triggers a redeployment of the Vercel project.

- **Returns:** An error object if the redeployment fails.

### `vercelVerifyDomain(domain: string): Promise<any>`

Verifies a domain in a Vercel project.

- **Parameters:**
  - `domain` (string): The domain name to be verified.
- **Returns:** The response data from the Vercel API or null if verification fails.

### `vercelDomainLinkedVerification(domain: string): Promise<any>`

Verifies if a domain is linked to a Vercel project.

- **Parameters:**
  - `domain` (string): The domain name to be checked.
- **Returns:** The response data from the Vercel API.

### `vercelRemoveDomain(domain: string): Promise<any>`

Removes a domain from a Vercel project.

- **Parameters:**
  - `domain` (string): The domain name to be removed.
- **Returns:** An error object if the removal fails.

## Environment Variables

The following environment variables are required for the `VercelService` class to function correctly:

- `VERCEL_PROJECT_ID`: The ID of the Vercel project.
- `VERCEL_TEAM_ID`: The ID of the Vercel team.
- `VERCEL_API_TOKEN`: The API token for accessing the Vercel API.
- `VERCEL_GIT_BRANCH` (optional): The Git branch to be used.
- `VERCEL_DEPLOYMENT_URL`: The URL to trigger redeployment.
- `SITE_DOMAINS`: A comma-separated list of site domains.
