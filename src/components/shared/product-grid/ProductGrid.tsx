import NextLink from 'next/link'
import { Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Stack } from "@chakra-ui/react";
import { Products } from '@/models/products.model';//Está bien así?
import { ProductCard } from '../product';


interface ProductsProps{
    products: Products[];
}

export const ProductGrid: React.FC<ProductsProps> = ({ products }) => {
    //Le añado la clave key a card para que react pueda saber qué elementos cambian, se agregan o se eliminan, he leido que asi react puede ser más eficiente con las listas dinámicas
    //He gastado en general porque tengo que devolver un contenedor con todos los resultados de productos
    //Falta hacer que los botones de comprar y añadir a carrito funcionen
    //Mirar bien como integrar con las diferentes páginas
    return (
      <Stack spacing={4}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Stack>
    );
  };