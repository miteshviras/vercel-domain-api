import Env from "@ioc:Adonis/Core/Env";
import axios from "axios";
import { parse } from "tldts";

/**
 * VercelService class provides methods to interact with the Vercel API for domain management and deployment.
 */
export default class VercelService {
  /**
   * Adds a domain to a Vercel project.
   * @param domain - The domain name to be added.
   * @returns The response data from the Vercel API or an error object.
   */
  public static async addDomainToVercel(domain: string): Promise<any> {
    const projectId = Env.get("VERCEL_PROJECT_ID");
    const teamId = Env.get("VERCEL_TEAM_ID");
    const accessToken = Env.get("VERCEL_API_TOKEN");

    const payload: any = {
      name: domain,
    };

    if (Env.get("VERCEL_GIT_BRANCH") !== "") {
      payload.gitBranch = Env.get("VERCEL_GIT_BRANCH");
    }

    try {
      const { data } = await axios.post(
        `https://api.vercel.com/v10/projects/${projectId}/domains?teamId=${teamId}`,
        payload,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );

      return data;
    } catch (error) {
      return { error: error };
    }
  }

  /**
   * Verifies the DNS configuration of a domain in Vercel.
   * @param domain - The domain name to be verified.
   * @returns The DNS configuration data and subdomain information.
   */
  public static async vercelDomainDNSVerification(domain: string): Promise<any> {
    const teamId = Env.get("VERCEL_TEAM_ID");
    const accessToken = Env.get("VERCEL_API_TOKEN");

    const { data } = await axios.get(
      `https://api.vercel.com/v6/domains/${domain}/config?teamId=${teamId}`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    const parsedData = await parse(domain);
    if (parsedData && parsedData.subdomain) {
      data.cnames = ["cname.vercel-dns.com"];
    } else {
      data.aValues = ["76.76.21.21"];
    }

    return { ...data, subdomain: parsedData.subdomain };
  }

  /**
   * Triggers a redeployment of the Vercel project.
   * @returns An error object if the redeployment fails.
   */
  public static async vercelRedeploy(): Promise<any> {
    try {
      await axios.get(Env.get("VERCEL_DEPLOYMENT_URL"));
    } catch (error) {
      return { error: error };
    }
  }

  /**
   * Verifies a domain in a Vercel project.
   * @param domain - The domain name to be verified.
   * @returns The response data from the Vercel API or null if verification fails.
   */
  public static async vercelVerifyDomain(domain: string): Promise<any> {
    const projectId = Env.get("VERCEL_PROJECT_ID");
    const teamId = Env.get("VERCEL_TEAM_ID");
    const accessToken = Env.get("VERCEL_API_TOKEN");
    try {
      const { data } = await axios.post(
        `https://api.vercel.com/v9/projects/${projectId}/domains/${domain}/verify?teamId=${teamId}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      return data;
    } catch {
      return null;
    }
  }

  /**
   * Verifies if a domain is linked to a Vercel project.
   * @param domain - The domain name to be checked.
   * @returns The response data from the Vercel API.
   */
  public static async vercelDomainLinkedVerification(domain: string): Promise<any> {
    const projectId = Env.get("VERCEL_PROJECT_ID");
    const teamId = Env.get("VERCEL_TEAM_ID");
    const accessToken = Env.get("VERCEL_API_TOKEN");

    await VercelService.vercelVerifyDomain(domain);

    const { data } = await axios.get(
      `https://api.vercel.com/v9/projects/${projectId}/domains/${domain}?teamId=${teamId}`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    return data;
  }

  /**
   * Removes a domain from a Vercel project.
   * @param domain - The domain name to be removed.
   * @returns An error object if the removal fails.
   */
  public static async vercelRemoveDomain(domain: string): Promise<any> {
    try {
      const accessToken = Env.get("VERCEL_API_TOKEN");
      const siteDomains = Env.get("SITE_DOMAINS", "").split(",");
      const teamId = Env.get("VERCEL_TEAM_ID");
      const projectId = Env.get("VERCEL_PROJECT_ID");

      if (siteDomains.includes(domain)) {
        return;
      }

      await axios.delete(
        `https://api.vercel.com/v9/projects/${projectId}/domains/${domain}?teamId=${teamId}`,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );
    } catch (error) {
      return { error: error };
    }
  }
}
