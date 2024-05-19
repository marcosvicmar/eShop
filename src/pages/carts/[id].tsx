import { SmallIndividualProduct } from "@/components/carts";
import { ShopSkeleton } from "@/components/layouts";
import { 
  useCartProvider,
  useOrderProvider,
  withCartProvider, 
  withOrderProvider 
} from "@/providers";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Input,
  Select,
  TagLabel,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

function IndividualCartRaw() {
  const { query, push } = useRouter();
  const { removeEntireCart } = useCartProvider();
  const { convertCartToOrder } = useOrderProvider();

  const [cart, setCart] = useState<any | null>(null);
  const [totalCart, setTotalCart] = useState<any | null>(null);
  
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");

  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardDate, setCardDate] = useState<string>("");
  const [cardSecurityCode, setCardSecurityCode] = useState<string>("");

  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  const { getCart, getTotalCart } = useCartProvider();

  const cartId = parseInt(query.id as string);

  useEffect(() => {
    getCart(cartId).then((cart) => cart !== undefined && setCart(cart));
    getTotalCart(cartId).then((data) => data !== undefined && setTotalCart(data));
  }, [query.id]);

  return (
    <ShopSkeleton>
      <Flex direction={"row"}>
        <Container maxH={"4rem"}>
          <Flex direction={"column"} gap={"1rem"}>
            <Heading size="lg">Cart</Heading>
            <Box>
              <Text>Total - {parseFloat(totalCart?.totalPrice).toFixed(2)} €</Text>
            </Box>
          </Flex>
          <Box>
            <span>{totalCart?.totalItems} Articles</span>
            {cart?.cartLine!! && cart.cartLine.map(
              (article: any) => 
                <SmallIndividualProduct productId={article.productId} units={1} />
            )}
          </Box>
        </Container>

        <Container maxH={"4rem"}>
          <Box margin={"1rem"}>
            <span>
              Personal Information
            </span>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <Input value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="Surname" />
          </Box>

          <Box margin={"1rem"}>
            <span>
              Payment Information
            </span>
            <Input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Card Number" />
            <Input value={cardDate} onChange={(e) => setCardDate(e.target.value)} placeholder="Expiration Date" />
            <Input value={cardSecurityCode} onChange={(e) => setCardSecurityCode(e.target.value)} placeholder="CVV" />
          </Box>

          <Box margin={"1rem"}>
            <span>
              Shipping Information
            </span>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
            <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postal Code" />
            <Input value={province} onChange={(e) => setProvince(e.target.value)} placeholder="Province" />
          </Box>

          <Box margin={"1rem"}>
            <span>
              Country
            </span>
            <Select placeholder="Select a country" value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="es">Spain</option>
              <option value="fr">French</option>
              <option value="gr">Germany</option>
            </Select>
          </Box>

          <Button 
            margin={"1rem"} 
            color="green" 
            onClick={() => convertCartToOrder(cartId, {
              name: name,
              surname: surname,
              address: address,
              city: city,
              country: country,
              postalCode: postalCode,
              province: province,
            })}
          >
            Buy now
          </Button>
          <Button 
            margin={"1rem"} 
            color="red" 
            onClick={() => removeEntireCart(cartId).then(() => push('/'))}
          >
            Delete cart
          </Button>
        </Container>
      </Flex>
    </ShopSkeleton>
  );
}

export default withCartProvider(
  withOrderProvider(
    IndividualCartRaw
  )
);