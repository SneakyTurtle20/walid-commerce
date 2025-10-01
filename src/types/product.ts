export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  rating: number;
  brand: string;
  images: string[];
  reviews: Review[];
};

export type Category = {
  slug: string;
  name: string;
  url: string;
};

type Review = {
  comment: string;
  rating: number;
  reviewerEmail: string;
  reviewerName: string;
};
