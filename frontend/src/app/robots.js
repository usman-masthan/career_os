import {getProfile,optional} from "./data";
export const dynamic = "force-dynamic";
export default async function robots(){const {data}=await optional(getProfile);const base=data[0]?.website_url||process.env.NEXT_PUBLIC_SITE_URL;if(!base)return {rules:[{userAgent:"*",allow:"/",disallow:["/admin/"]}]};return {rules:[{userAgent:"*",allow:"/",disallow:["/admin/"]}],sitemap:`${base.replace(/\/$/,"")}/sitemap.xml`};}
