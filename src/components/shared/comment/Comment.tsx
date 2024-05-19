// Comentario.tsx

import React, { use, useEffect } from 'react';
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { useSession } from '@/providers/session.provider';
import { useRouter } from 'next/router';

interface CommentProps {
  userId: string;
  date: string;
  comment: string;
}

export const Comment: React.FC<CommentProps> = ({ userId, date, comment }) => {
  const [userData, setUserData] = React.useState<any | null>(null);
  const { token } = useSession();
  const { push } = useRouter();

  useEffect(() => {
    fetch(`/api/v1/users?id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUserData(data));
  }, []);

  return (
    <Box p={4} minH={"5rem"} minW={"100%"} borderWidth="1px" borderRadius="lg">
      <Flex>
        <Avatar name={userData?.name} />
        <Box ml={3}>
          <Text fontWeight="bold">{userData?.name}</Text>
          <Text fontSize="sm" color="gray.500">
            {date}
          </Text>
          <Text>
            {comment}
          </Text>
        </Box>
      </Flex>
      <Text mt={2} placeholder="Escribe tu comentario..." />
    </Box>
  );
};

