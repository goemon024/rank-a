import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jnpxbqroccjpcvlofztq.supabase.co",
        pathname: "/**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     domains: [
//       "jnpxbqroccjpcvlofztq.supabase.co",
//       // 他に使う外部画像ドメインがあればここに追加
//     ],
//   },
//   /* config options here */
// };

// export default nextConfig;
