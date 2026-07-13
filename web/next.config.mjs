/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',            // static export for cPanel (upload ./out to public_html)
  images: { unoptimized: true },
  trailingSlash: true,
};
export default nextConfig;
