/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{

            protocol: 'https',
            hostname: 'images.unsplash.com',
        },
        {
            protocol: 'https',
            hostname: 'img.clerk.com',
        },
        {
            protocol: 'https',
            hostname: 'cdn-icons-png.flaticon.com',
        },
        {
            hostname: "cdn.sanity.io",
            protocol: "https",
        },],
    },
};

export default nextConfig;
