export const loader = () => {
    // handle "GET" request
// separating xml content from Response to keep clean code.
    const content = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://bultehi.com</loc>
    <lastmod>2024-05-05T15:02:24.021Z</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://bultehi.com/high</loc>
    <lastmod>2024-05-05T15:02:24.021Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://bultehi.com/middle</loc>
    <lastmod>2024-05-05T15:02:24.021Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://bultehi.com/elementary</loc>
    <lastmod>2024-05-05T15:02:24.021Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`
    // Return the response with the content, a status 200 message, and the appropriate headers for an XML page
    return new Response(content,{
        status: 200,
        headers: {
            "Content-Type": "application/xml",
            "xml-version": "1.0",
            "encoding": "UTF-8"
        }
    });
};