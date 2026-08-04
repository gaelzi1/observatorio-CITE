
export function generateAPA(article) {
  const year = new Date(article.createdAt).getFullYear();

  return `${article.autor}. (${year}). ${article.title}. Observatorio CITE.`;
}
