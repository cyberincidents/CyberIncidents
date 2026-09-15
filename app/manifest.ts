import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CyberIncidents - Threats today, a safer tomorrow",
    short_name: "CyberIncidents",
    description:
      "A cybersecurity publication covering real-world threats, vulnerabilities, adversarial tactics, zero-day telemetry, and technical post-mortems for security defenders.",
    start_url: "/",
    display: "standalone",
    background_color: "#05070a",
    theme_color: "#00a8ff",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}