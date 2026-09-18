import secComContent from "@/blogs/SecCom.md?raw";
import highWebClusterContent from "@/blogs/highWebCluster.md?raw";

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
  category: string;
  content: string;
}

export const blogPosts: Post[] = [
  {
    slug: "secure-communication-setup-between-apache-tomcat-and-mysql-using-tlsv1.2",
    title: "Secure Communication Setup between Apache Tomcat and MySQL using TLSv1.2",
    date: "March 15, 2026",
    excerpt:
      "Configuring Apache Tomcat and a MySQL server so that Tomcat itself — not just the applications deployed within it — establishes a secure TLSv1.2 connection to the database.",
    readTime: "5 min read",
    category: "Security",
    content: secComContent,
  },
  {
    slug: "high-availability-web-cluster",
    title: "High-Availability Web Cluster with Load Balancing & Automatic Failover",
    date: "March 10, 2025",
    excerpt:
      "Building a production-grade high-availability web cluster with load balancing and automatic failover capabilities.",
    readTime: "7 min read",
    category: "Infrastructure",
    content: highWebClusterContent,
  },
];
