import * as cookie from 'cookie';
import * as admin from 'firebase-admin';
import * as serviceAccount from './serviceAccount.json';

import { readFileSync } from 'fs';

const color = readFileSync('./static/colors.css', 'utf-8');

const lightColor = color.split('/* Dark */')[0] + color.split('/* Both */')[1];
const darkColor = color.split('/* Dark */')[1]

const params = {  type: serviceAccount.type,  projectId: serviceAccount.project_id,  privateKeyId: serviceAccount.private_key_id,  privateKey: serviceAccount.private_key,  clientEmail: serviceAccount.client_email,  clientId: serviceAccount.client_id,  authUri: serviceAccount.auth_uri,  tokenUri: serviceAccount.token_uri,  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,  clientC509CertUrl: serviceAccount.client_x509_cert_url}

const app = admin.initializeApp({
    credential: admin.credential.cert(params)
}, `Viper${Date.now()}`);

async function verifyToken(token: string) {
    try { await admin.auth(app).verifyIdToken(token) } catch (error) {
        console.log(error)
        return false;
    }
    return true;
}

export async function handle({ request, resolve }) {
    const response = await resolve(request);

    const cookies = request.headers.cookie ? cookie.parse(request.headers.cookie) : undefined;

    try{
        var user = JSON.parse(cookies['user']);
    }catch(e) {
        var user;
    }

    let verified = false;

    if(cookies && cookies['theme'] == 'dark') response.body = response.body.replace(`/* colorcss */`, darkColor);
    else response.body = response.body.replace(`/* colorcss */`, lightColor);
    
    if(user) {
        verified = await verifyToken(user.stsTokenManager.accessToken)

        response.headers['Set-Cookie'] = `verified=${verified};`;

        // User shouldn't be able to login again after already logging in
        if(request.path.startsWith('/login') && verified) {
            return {
                status: 301,
                headers: {
                    Location: '/'
                }
            }
        }
    }

    return {
        ...response,
        headers: {
            ...response.headers
        }
    }
}