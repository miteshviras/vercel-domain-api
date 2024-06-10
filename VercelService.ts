import Env from '@ioc:Adonis/Core/Env';
import axios from 'axios';
import { parse } from 'tldts';

export default class VercelService {
    public static async addDomainToVercel(domain: string) {
        const projectId = Env.get('VERCEL_PROJECT_ID');
        const teamId = Env.get('VERCEL_TEAM_ID');
        const accessToken = Env.get('VERCEL_API_TOKEN');


        const payload: any = {
            name: domain,
        };

        if (Env.get('VERCEL_GIT_BRANCH') !== '') {
            payload.gitBranch = Env.get('VERCEL_GIT_BRANCH');
        }

        try {
            const { data } = await axios.post(
                `https://api.vercel.com/v10/projects/${projectId}/domains?teamId=${teamId}`,
                payload,
                {
                    headers: {
                        Authorization: 'Bearer ' + accessToken,
                    },
                }
            );

            return data;
        } catch (error) {
            return { error: error };
        }
    }

    public static async vercelDomainDNSVerification(domain: string) {
        const teamId = Env.get('VERCEL_TEAM_ID');
        const accessToken = Env.get('VERCEL_API_TOKEN');

        const { data } = await axios.get(
            `https://api.vercel.com/v6/domains/${domain}/config?teamId=${teamId}`,
            {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                },
            }
        );

        const parsedData = await parse(domain);
        if (parsedData && parsedData.subdomain) {
            data.cnames = ['cname.vercel-dns.com'];
        } else {
            data.aValues = ['76.76.21.21'];
        }

        return { ...data, subdomain: parsedData.subdomain };
    }

    public static async vercelRedeploy() {
        try {
            await axios.get(Env.get('VERCEL_DEPLOYMENT_URL'));
        } catch (error) {
            return { error: error };
        }
    }

    public static async vercelVerifyDomain(domain: string) {
        const projectId = Env.get('VERCEL_PROJECT_ID');
        const teamId = Env.get('VERCEL_TEAM_ID');
        const accessToken = Env.get('VERCEL_API_TOKEN');
        try {
            const { data } = await axios.post(
                `https://api.vercel.com/v9/projects/${projectId}/domains/${domain}/verify?teamId=${teamId}`,
                {},
                {
                    headers: {
                        Authorization: 'Bearer ' + accessToken,
                    },
                }
            );
            return data;
        } catch {
            return null;
        }
    }

    public static async vercelDomainLinkedVerification(domain: string) {
        const projectId = Env.get('VERCEL_PROJECT_ID');
        const teamId = Env.get('VERCEL_TEAM_ID');
        const accessToken = Env.get('VERCEL_API_TOKEN');

        await VercelService.vercelVerifyDomain(domain);

        const { data } = await axios.get(
            `https://api.vercel.com/v9/projects/${projectId}/domains/${domain}?teamId=${teamId}`,
            {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                },
            }
        );
        return data;
    }

    public static async vercelRemoveDomain(domain: string) {
        try {
            const accessToken = Env.get('VERCEL_API_TOKEN');
            const siteDomains = Env.get('SITE_DOMAINS', '').split(',');
            const teamId = Env.get('VERCEL_TEAM_ID');
            const projectId = Env.get('VERCEL_PROJECT_ID');

            if (siteDomains.includes(domain)) {
                return;
            }

            await axios.delete(
                `https://api.vercel.com/v9/projects/${projectId}/domains/${domain}?teamId=${teamId}`,
                {
                    headers: {
                        Authorization: 'Bearer ' + accessToken,
                    },
                }
            );
        } catch (error) {
            return { error: error };
        }
    }
}
