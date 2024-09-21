/** @type {import('next').NextConfig} */
const nextConfig = {
    headers: async () => {
        return [
            {
                source: "/.well-known/did.json",
                headers: [
                    {
                        key: "Content-Type",
                        value: "application/json",
                    },
                ],
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "gateway.pinata.cloud",
            },
            {
                protocol: "https",
                hostname: "noun.pics",
            },
        ],
    },
};

export default nextConfig;
