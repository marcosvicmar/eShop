
import { useRouter } from 'next/router';
import { ProductCategories } from '@/components/products/product-categories';
import { ShopSkeleton } from '@/components';

const CategoryPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  return (
    <ShopSkeleton>
        <ProductCategories categoryId={id as string} />
    </ShopSkeleton>
  );
};

export default CategoryPage;
